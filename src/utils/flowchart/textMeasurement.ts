export const measureTextWidth = (text: string): number => {
    if (!text || text.length === 0) {
      text = 'Add a task!'; // Use placeholder text width if empty
    }
    
    // Split by lines to find the widest line
    const lines = text.split('\n');
    let maxWidth = 0;
    
    lines.forEach(line => {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.fontSize = '1.125rem'; // text-lg
      tempSpan.style.fontFamily = 'Inter, system-ui, sans-serif'; // Match your font
      tempSpan.style.whiteSpace = 'pre'; // Preserve whitespace
      tempSpan.innerText = line || ' '; // Handle empty lines
      document.body.appendChild(tempSpan);
      
      const width = tempSpan.getBoundingClientRect().width;
      if (width > maxWidth) maxWidth = width;
      
      document.body.removeChild(tempSpan);
    });
    
    return maxWidth;
  };