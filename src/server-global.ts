/* eslint-disable no-use-before-define */
import path from 'path';

import winston from 'winston';

class ServerGlobal {
	private readonly _logger: winston.Logger;

	private static _instance: ServerGlobal;

	private constructor() {
		this._logger = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({
					filename: path.join(__dirname, '../logs.log'),
					level: 'info',
				}),
			],
		});
	}

	/**
	 * Getter for singelton instance
	 * @returns ServerGlobal singelton instance
	 */
	public static getInstance() {
		if (this._instance) {
			return this._instance;
		}

		this._instance = new ServerGlobal();
		return this._instance;
	}

	/**
	 * Getter for the logger
	 * @returns logger instance
	 */
	public get logger() {
		return this._logger;
	}
}

export default ServerGlobal;
