import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { ExtractionResult, Diagram } from '@/types/api';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: false,
  },
  themeVariables: {
    fontFamily: 'Arial, sans-serif',
    primaryTextColor: '#111827',
    secondaryTextColor: '#111827',
    tertiaryTextColor: '#111827',
    lineColor: '#475569',
  },
});

type RenderedDiagram = {
  data: Uint8Array;
  width: number;
  height: number;
};

function getSvgDimensions(svg: string, maxWidth = 620): { width: number; height: number } {
  const viewBoxMatch = svg.match(/viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  const widthMatch = svg.match(/\swidth=["']([\d.]+)(?:px)?["']/i);
  const heightMatch = svg.match(/\sheight=["']([\d.]+)(?:px)?["']/i);

  const sourceWidth = Number(viewBoxMatch?.[1] ?? widthMatch?.[1] ?? 720);
  const sourceHeight = Number(viewBoxMatch?.[2] ?? heightMatch?.[1] ?? 420);
  const width = Math.min(maxWidth, sourceWidth);
  const height = Math.round((sourceHeight * width) / sourceWidth);

  return { width, height };
}

function prepareSvgForCapture(svg: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = document.querySelector('svg');

  if (!svgElement) {
    return svg;
  }

  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  svgElement.querySelectorAll('text, tspan').forEach((node) => {
    node.setAttribute('fill', '#111827');
    node.setAttribute('font-family', 'Arial, sans-serif');
    node.setAttribute('font-size', node.getAttribute('font-size') ?? '14');
    node.setAttribute('style', `${node.getAttribute('style') ?? ''}; fill: #111827; font-family: Arial, sans-serif;`);
  });

  return new XMLSerializer().serializeToString(svgElement);
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

async function svgToPng(svg: string, width: number): Promise<RenderedDiagram> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = `${width}px`;
  container.style.background = '#ffffff';
  container.style.padding = '16px';
  container.innerHTML = svg;
  document.body.appendChild(container);

  try {
    const svgElement = container.querySelector('svg');
    if (svgElement) {
      svgElement.style.maxWidth = '100%';
      svgElement.style.height = 'auto';
      svgElement.style.background = '#ffffff';
    }

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imageWidth = Math.min(620, canvas.width / 2);
    const imageHeight = Math.round((canvas.height / 2) * (imageWidth / (canvas.width / 2)));

    return {
      data: dataUrlToUint8Array(canvas.toDataURL('image/png')),
      width: imageWidth,
      height: imageHeight,
    };
  } finally {
    document.body.removeChild(container);
  }
}

async function renderDiagramImages(diagrams: Diagram[]): Promise<Record<number, RenderedDiagram>> {
  const renderedDiagrams: Record<number, RenderedDiagram> = {};

  for (let i = 0; i < diagrams.length; i++) {
    const diagram = diagrams[i];

    try {
      const diagramId = `docx-mermaid-${diagram.id}-${Date.now()}-${i}`;
      const diagramContent = `%%{init: {"flowchart": {"htmlLabels": false}, "theme": "default"}}%%\n${diagram.mermaid_content}`;
      const { svg } = await mermaid.render(diagramId, diagramContent);
      const preparedSvg = prepareSvgForCapture(svg);
      const dimensions = getSvgDimensions(preparedSvg);
      renderedDiagrams[diagram.id] = await svgToPng(preparedSvg, dimensions.width);
    } catch (error) {
      console.error(`Error rendering Mermaid diagram "${diagram.title}" for DOCX:`, error);
    }
  }

  return renderedDiagrams;
}

/**
 * Creates a Word document from the proposal data
 */
function createDocxDocument(
  proposal: ExtractionResult,
  projectName: string,
  diagrams: Diagram[],
  renderedDiagrams: Record<number, RenderedDiagram>
): Document {
  const sections: Paragraph[] = [];

  // Cover Page
  sections.push(
    new Paragraph({
      text: projectName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: 'Project Proposal',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: `Generated on ${new Date().toLocaleDateString()}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    })
  );

  // Project Overview
  sections.push(
    new Paragraph({
      text: 'Project Overview',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
    new Paragraph({
      text: 'Project Name',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.project_overview.project_name,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Problem Statement',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.project_overview.problem,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Proposed Solution',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.project_overview.proposed_solution,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Target Users',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  proposal.project_overview.target_users.forEach((user) => {
    sections.push(
      new Paragraph({
        text: user,
        bullet: { level: 0 },
        spacing: { after: 100 },
      })
    );
  });

  // Requirements
  sections.push(
    new Paragraph({
      text: 'Requirements',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
    new Paragraph({
      text: 'Functional Requirements',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  proposal.requirements.functional.forEach((req, idx) => {
    sections.push(
      new Paragraph({
        text: `${idx + 1}. ${req}`,
        spacing: { after: 100 },
      })
    );
  });

  sections.push(
    new Paragraph({
      text: 'Non-Functional Requirements',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  proposal.requirements.non_functional.forEach((req, idx) => {
    sections.push(
      new Paragraph({
        text: `${idx + 1}. ${req}`,
        spacing: { after: 100 },
      })
    );
  });

  // Feature Breakdown
  sections.push(
    new Paragraph({
      text: 'Feature Breakdown',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    })
  );

  proposal.feature_breakdown.forEach((feature) => {
    sections.push(
      new Paragraph({
        text: feature,
        bullet: { level: 0 },
        spacing: { after: 100 },
      })
    );
  });

  // User Flow
  sections.push(
    new Paragraph({
      text: 'User Flow',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    })
  );

  proposal.user_flow.forEach((step, idx) => {
    sections.push(
      new Paragraph({
        text: `${idx + 1}. ${step}`,
        spacing: { after: 100 },
      })
    );
  });

  // Business Process
  sections.push(
    new Paragraph({
      text: 'Business Process',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    })
  );

  proposal.business_process.forEach((step, idx) => {
    sections.push(
      new Paragraph({
        text: `${idx + 1}. ${step}`,
        spacing: { after: 100 },
      })
    );
  });

  // Project Scope
  sections.push(
    new Paragraph({
      text: 'Project Scope',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
    new Paragraph({
      text: 'In Scope',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  proposal.scope.in_scope.forEach((item) => {
    sections.push(
      new Paragraph({
        text: item,
        bullet: { level: 0 },
        spacing: { after: 100 },
      })
    );
  });

  sections.push(
    new Paragraph({
      text: 'Out of Scope',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  proposal.scope.out_of_scope.forEach((item) => {
    sections.push(
      new Paragraph({
        text: item,
        bullet: { level: 0 },
        spacing: { after: 100 },
      })
    );
  });

  // Technical Architecture
  sections.push(
    new Paragraph({
      text: 'Technical Architecture',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
    new Paragraph({
      text: 'Frontend',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.architecture.frontend,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Backend',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.architecture.backend,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Database',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.architecture.database,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Infrastructure',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: proposal.architecture.infrastructure,
      spacing: { after: 200 },
    })
  );

  if (proposal.architecture.integrations.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Integrations',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    proposal.architecture.integrations.forEach((integration) => {
      sections.push(
        new Paragraph({
          text: integration,
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
    });
  }

  // Timeline & Milestones
  sections.push(
    new Paragraph({
      text: 'Timeline & Milestones',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '2563EB',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    })
  );

  proposal.timeline.forEach((milestone, idx) => {
    sections.push(
      new Paragraph({
        text: `${idx + 1}. ${milestone}`,
        spacing: { after: 100 },
      })
    );
  });

  // Diagrams Section
  if (diagrams.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Project Diagrams',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: {
            color: '2563EB',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    diagrams.forEach((diagram) => {
      const renderedDiagram = renderedDiagrams[diagram.id];

      sections.push(
        new Paragraph({
          text: diagram.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      if (renderedDiagram) {
        sections.push(
          new Paragraph({
            children: [
              new ImageRun({
                type: 'png',
                data: renderedDiagram.data,
                transformation: {
                  width: renderedDiagram.width,
                  height: renderedDiagram.height,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      } else {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Diagram image could not be rendered. Mermaid source:',
                italics: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: diagram.mermaid_content,
            spacing: { after: 200 },
            style: 'Code',
          })
        );
      }
    });
  }

  return new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });
}

/**
 * Exports the proposal as a Word document
 */
export async function exportToDocx(
  proposal: ExtractionResult,
  projectName: string,
  diagrams: Diagram[],
  filename: string
): Promise<void> {
  try {
    const renderedDiagrams = await renderDiagramImages(diagrams);
    const doc = createDocxDocument(proposal, projectName, diagrams, renderedDiagrams);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export Word document. Please try again.');
  }
}

// Made with Bob
