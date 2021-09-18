class ProgressBar {
  private readonly bar: any;
  constructor(Bar: any, format: string, total: number) {
    if (typeof total === 'string') {
      total = parseInt(total);
    }

    let options = {
      total: total,
      complete: '\u2588',
      incomplete: '\u2591',
      stream: process.stdout,
      width: Math.floor(process.stdout.columns / 2),
    };
    this.bar = new Bar(format, options);
  }

  tick(count: number = 1, customTokens?: any) {
    this.bar.tick(count, customTokens);
  }

  log(msg: string) {
    this.bar.interrupt(msg);
  }
}

export async function getProgressBar(format: string, total: number) {
  return new ProgressBar(await import('progress'), format, total);
}
