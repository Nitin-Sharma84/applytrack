import './Button.css'

/**
 * @param {{
 *   variant?: 'primary'|'secondary'|'ghost'|'danger',
 *   size?: 'sm'|'md'|'lg',
 *   iconOnly?: boolean,   // square button. Always pass aria-label with it.
 *   fullWidth?: boolean,
 *   leftIcon?: import('react').ReactNode,
 * } & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
  leftIcon = null,
  type = 'button', // default "button" so a button inside a form never submits by accident
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    iconOnly && 'btn--icon',
    fullWidth && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {leftIcon}
      {children}
    </button>
  )
}