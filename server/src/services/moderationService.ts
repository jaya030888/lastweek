export interface ModerationResult {
  hasPii: boolean;
  warnings: string[];
  safeToPost: boolean;
  highlightedText?: string;
}

export class ModerationService {
  // Regex to detect phone numbers (Indian & international formats: 10-digit mobile, +91, dashes, spaces)
  private static phoneRegex = /(?:(?:\+?91[\s.-]?)?\(?\d{3,5}\)?[\s.-]?\d{3}[\s.-]?\d{4})|(?:[6-9]\d{9})/g;

  // Regex to detect email addresses
  private static emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Regex for 12-digit numbers resembling Aadhaar or SSN
  private static idNumberRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;

  // Patterns for physical addresses or location doxxing
  private static addressPattern = /\b(flat|house|plot|road|street|nagar|colony|apartment|sector|lane|pincode|pin code)\s*(?:no\.?|#)?\s*\d+/i;

  public static inspectText(content: string, title: string = ''): ModerationResult {
    const combined = `${title} ${content}`;
    const warnings: string[] = [];

    // Check for phone numbers
    const phoneMatches = combined.match(this.phoneRegex);
    if (phoneMatches && phoneMatches.length > 0) {
      warnings.push('Detected potential phone number(s). To protect your privacy and safety, sharing contact numbers publicly is strongly discouraged.');
    }

    // Check for email addresses
    const emailMatches = combined.match(this.emailRegex);
    if (emailMatches && emailMatches.length > 0) {
      warnings.push('Detected email address. Your pseudonym protects you, but personal emails can reveal your real identity.');
    }

    // Check for ID numbers
    const idMatches = combined.match(this.idNumberRegex);
    if (idMatches && idMatches.length > 0) {
      warnings.push('Detected 12-digit number resembling an identity or card number. Never share government identification or financial numbers.');
    }

    // Check for precise street address
    if (this.addressPattern.test(combined)) {
      warnings.push('Detected potential specific physical address. We advise discussing general areas rather than exact home or workplace addresses.');
    }

    const hasPii = warnings.length > 0;

    return {
      hasPii,
      warnings,
      safeToPost: !hasPii, // If warnings exist, the frontend prompts the user to review or confirm redact
    };
  }

  public static maskSensitiveDetails(text: string): string {
    return text
      .replace(this.phoneRegex, '[REDACTED_PHONE]')
      .replace(this.emailRegex, '[REDACTED_EMAIL]')
      .replace(this.idNumberRegex, '[REDACTED_ID]');
  }
}

