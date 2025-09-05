export class CSVEmailLoader {
  async loadEmailsFromCSV(): Promise<any[]> {
    try {
      const response = await fetch('/data/68b1acd44f393_Sample_Support_Emails_Dataset (2).csv');
      const csvText = await response.text();
      
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      const emails = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = this.parseCSVLine(line);
          const email: any = {};
          
          headers.forEach((header, i) => {
            email[header.trim()] = values[i]?.trim() || '';
          });
          
          email.id = `email_${index + 1}`;
          return email;
        });
      
      return emails;
    } catch (error) {
      console.error('Error loading CSV emails:', error);
      return [];
    }
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }
}