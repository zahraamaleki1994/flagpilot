export class FlagPilot {
  private url: string;

  constructor({ url }: { url: string }) {
    this.url = url.replace(/\/$/, '');
  }

  async isEnabled(key: string): Promise<boolean> {
    const response = await fetch(`${this.url}/eval/${key}`);
    if (!response.ok) return false;
    const data = (await response.json()) as { key: string; enabled: boolean };
    return data.enabled;
  }
}
