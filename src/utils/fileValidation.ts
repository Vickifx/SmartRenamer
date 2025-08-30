// Validate filename for illegal characters and patterns
export const validateFilename = (filename: string): { isValid: boolean; error?: string } => {
  if (!filename.trim()) {
    return { isValid: false, error: 'Filename cannot be empty' };
  }

  // Check for illegal characters
  const illegalChars = /[<>:"/\\|?*]/;
  if (illegalChars.test(filename)) {
    return { isValid: false, error: 'Contains illegal characters: < > : " / \\ | ? *' };
  }

  // Check for reserved names (Windows)
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  const nameWithoutExt = filename.split('.')[0];
  if (reservedNames.test(nameWithoutExt)) {
    return { isValid: false, error: 'Reserved system name' };
  }

  // Check length (most filesystems have a 255 character limit)
  if (filename.length > 255) {
    return { isValid: false, error: 'Filename too long (max 255 characters)' };
  }

  // Check for names that start or end with dots or spaces
  if (filename.startsWith('.') && filename.length === 1) {
    return { isValid: false, error: 'Invalid filename' };
  }

  if (filename.endsWith('.') || filename.endsWith(' ')) {
    return { isValid: false, error: 'Cannot end with dot or space' };
  }

  return { isValid: true };
};

// Preserve file extension when editing name
export const preserveExtension = (originalName: string, newName: string): string => {
  const originalExt = originalName.split('.').pop();
  const newNameWithoutExt = newName.split('.')[0] || newName;
  
  // If original file has extension and new name doesn't include it, add it
  if (originalExt && originalName.includes('.') && !newName.includes('.')) {
    return `${newNameWithoutExt}.${originalExt}`;
  }
  
  return newName;
};

// Check if filename has been modified from original
export const isFilenameModified = (originalName: string, newName: string): boolean => {
  return originalName !== newName;
};