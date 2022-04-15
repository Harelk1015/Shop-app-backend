import mongoose from 'mongoose';

interface ITicket extends mongoose.Document {
	readonly ownerId: mongoose.Types.ObjectId;
	readonly subject: string;
	readonly email: string;
	readonly message: string;
}

const ticketSchema: mongoose.Schema = new mongoose.Schema(
	{
		ownerId: { required: true, type: mongoose.Types.ObjectId },
		subject: { required: true, type: String },
		email: { required: true, type: String },
		message: { required: true, type: String },
	},
	{ timestamps: true },
);

const TicketDB = mongoose.model<ITicket>('Ticket', ticketSchema);

export { TicketDB, ITicket };
