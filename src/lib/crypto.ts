export function obfuscateToken(token: string): string {
  const key = typeof window !== 'undefined' ? window.location.origin : 'rawtes';
  return btoa(
    token.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('')
  );
}

export function deobfuscateToken(obfuscated: string): string {
  const key = typeof window !== 'undefined' ? window.location.origin : 'rawtes';
  try {
    const decoded = atob(obfuscated);
    return decoded.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  } catch (e) {
    return '';
  }
}
