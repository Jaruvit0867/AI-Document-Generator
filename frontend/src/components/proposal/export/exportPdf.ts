import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

const UNSUPPORTED_COLOR_FUNCTION = /\b(?:lab|lch|oklab|oklch|color|color-mix)\(/i;

function safeCssColor(value: string, fallback: string): string {
  if (!value || UNSUPPORTED_COLOR_FUNCTION.test(value)) {
    return fallback;
  }

  return value;
}

function prepareElementForCanvas(element: HTMLElement): void {
  const nodes = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))];

  nodes.forEach((node) => {
    const styles = window.getComputedStyle(node);

    node.style.color = safeCssColor(styles.color, '#334155');
    node.style.backgroundColor = safeCssColor(styles.backgroundColor, 'transparent');
    node.style.borderTopColor = safeCssColor(styles.borderTopColor, '#e2e8f0');
    node.style.borderRightColor = safeCssColor(styles.borderRightColor, '#e2e8f0');
    node.style.borderBottomColor = safeCssColor(styles.borderBottomColor, '#e2e8f0');
    node.style.borderLeftColor = safeCssColor(styles.borderLeftColor, '#e2e8f0');
    node.style.outlineColor = safeCssColor(styles.outlineColor, '#2563eb');
    node.style.textDecorationColor = safeCssColor(styles.textDecorationColor, 'currentColor');
    node.style.boxShadow = 'none';
    node.style.textShadow = 'none';

    if (UNSUPPORTED_COLOR_FUNCTION.test(styles.backgroundImage)) {
      node.style.backgroundImage = 'none';
    }
  });

  element.style.backgroundColor = '#ffffff';
}

/**
 * Renders Mermaid diagrams in the document before PDF export
 */
async function renderMermaidDiagrams(element: HTMLElement): Promise<void> {
  const diagramContainers = element.querySelectorAll('.mermaid-diagram');
  
  for (let i = 0; i < diagramContainers.length; i++) {
    const container = diagramContainers[i] as HTMLElement;
    const diagramContent = container.getAttribute('data-diagram-content');
    
    if (diagramContent) {
      try {
        // Create a unique ID for this diagram
        const diagramId = `mermaid-${Date.now()}-${i}`;
        
        // Render the mermaid diagram
        const { svg } = await mermaid.render(diagramId, diagramContent);
        
        // Replace the pre element with the rendered SVG
        container.innerHTML = svg;
        
        // Style the SVG for better PDF rendering
        const svgElement = container.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = '100%';
          svgElement.style.height = 'auto';
        }
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        // Keep the original content if rendering fails
      }
    }
  }
}

/**
 * Exports the proposal document as a PDF
 */
export async function exportToPdf(
  elementId: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  let clonedElement: HTMLElement | null = null;

  try {
    onProgress?.(10);
    
    // Get the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Clone the element to avoid modifying the original
    clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    document.body.appendChild(clonedElement);

    onProgress?.(20);

    // Render mermaid diagrams
    await renderMermaidDiagrams(clonedElement);
    prepareElementForCanvas(clonedElement);

    onProgress?.(40);

    // Convert to canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    onProgress?.(70);

    // Remove cloned element
    document.body.removeChild(clonedElement);
    clonedElement = null;

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add image to PDF (handle multiple pages if needed)
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    onProgress?.(90);

    // Save the PDF
    pdf.save(filename);

    onProgress?.(100);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  } finally {
    if (clonedElement?.parentNode) {
      clonedElement.parentNode.removeChild(clonedElement);
    }
  }
}

// Made with Bob
