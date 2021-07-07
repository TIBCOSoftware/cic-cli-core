// TODO: Standardize the output format from the spinner for ex: "::
export async function spinner(options?: any) {
  const ora = await import('ora');
  return ora(options);
}
