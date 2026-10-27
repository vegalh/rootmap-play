import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { buttonClassName, type ButtonVariant } from './buttonStyles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

/** Native <button> styled as a RootMap Play call-to-action. */
export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button className={buttonClassName(variant, className)} {...rest} />
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
}

/** Internal navigation styled the same way as Button, via react-router's Link. */
export function LinkButton({ variant = 'primary', className = '', ...rest }: LinkButtonProps) {
  return <Link className={buttonClassName(variant, className)} {...rest} />
}

interface AnchorButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
}

/** External link styled the same way as Button. */
export function AnchorButton({ variant = 'primary', className = '', ...rest }: AnchorButtonProps) {
  return <a className={buttonClassName(variant, className)} {...rest} />
}
