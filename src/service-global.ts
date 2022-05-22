/* eslint-disable no-use-before-define */
import path from 'path';

import winston from 'winston';

class ServiceGlobal {
	private readonly _logger: winston.Logger;

	private static _instance: ServiceGlobal;

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
	 * @returns ServiceGlobal singelton instance
	 */
	public static getInstance() {
		if (this._instance) {
			return this._instance;
		}

		this._instance = new ServiceGlobal();
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

export default ServiceGlobal;
