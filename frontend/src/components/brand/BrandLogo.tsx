import Image from 'next/image';
import logoWordmark from '../../../assets/logo-wordmark.png';

type BrandLogoSize = 'sm' | 'md' | 'lg';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showSubtitle?: boolean;
  size?: BrandLogoSize;
  subtitle?: string;
}

const sizeStyles: Record<BrandLogoSize, string> = {
  sm: 'h-9 w-36',
  md: 'h-11 w-44',
  lg: 'h-14 w-56',
};

export const APP_NAME = 'Vision Draft';
export const APP_SLOGAN = 'Turning scattered requirements into actionable project plans';

export const BrandLogo = ({
  className = '',
  imageClassName = '',
  priority = false,
  showSubtitle = false,
  size = 'md',
  subtitle = APP_SLOGAN,
}: BrandLogoProps) => {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeStyles[size]} ${imageClassName}`}>
        <Image
          src={logoWordmark}
          alt={APP_NAME}
          fill
          priority={priority}
          sizes={size === 'lg' ? '224px' : size === 'md' ? '176px' : '144px'}
          className="object-contain"
        />
      </div>
      {showSubtitle && (
        <p className="hidden max-w-60 text-xs leading-4 text-ink-faint sm:block">
          {subtitle}
        </p>
      )}
    </div>
  );
};
