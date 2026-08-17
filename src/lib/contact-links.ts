export function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
