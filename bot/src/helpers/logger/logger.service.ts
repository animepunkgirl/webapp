import {Inject, Injectable, LoggerService, Scope} from "@nestjs/common";
import 'colors';
import {INQUIRER} from "@nestjs/core";
import {ConfigService} from "@nestjs/config";

export abstract class LoggerBase implements LoggerService {
  private dateFormat: Intl.DateTimeFormatOptions  = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false,
    hour: 'numeric',
    second: 'numeric',
    minute: 'numeric',
  };
  abstract namespace: string;
  abstract isDev: boolean;

  log(msg: unknown): void {
    console.info(this.getMessage('INFO', msg).green);
  }

  error(msg: unknown): void {
    console.error(this.getMessage('ERROR', msg).red);
  }

  warn(msg: unknown): void {
    console.error(this.getMessage('WARN', msg).yellow);
  }

  debug(msg: unknown): void {
    if (this.isDev)
      return;

    console.log(msg)
  }

  private getTime(): string {
    return new Date().toLocaleString('en-US', this.dateFormat);
  }

  private getMessage(indicator: string, msg: unknown): string {
    const time = this.getTime()
    return `[${this.namespace}] [${time}] [${indicator}] ${msg}`
  }
}

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends LoggerBase {
  namespace;
  isDev;

  constructor(
    @Inject(INQUIRER) private parentClass: object,
    private configService: ConfigService
  ) {
    super()
    this.namespace = this.parentClass.constructor.name
    this.isDev = this.configService.get<string>('NODE_ENV') !== 'production'
  }
}

export class AppLogger extends LoggerBase {
  namespace = 'Application'
  isDev = false

  constructor() {
    super();
  }
}
