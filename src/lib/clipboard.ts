export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const helper = document.createElement('textarea')
    helper.value = text
    helper.setAttribute('readonly', '')
    helper.style.position = 'fixed'
    helper.style.top = '0'
    helper.style.opacity = '0'
    document.body.appendChild(helper)
    helper.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(helper)
    return copied
  }
}
