import { toast } from 'sonner';

export async function copyToClipboard(text: string, successMessage = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    toast.error('Failed to copy to clipboard');
    return false;
  }
}
