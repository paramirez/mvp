import mongoose from 'mongoose';
import sequence from 'mongoose-sequence';

const autoIncrement = sequence(mongoose);
const Schema = mongoose.Schema;

const rolSchema = new Schema(
	{
		name: {
			type: String,
			unique: true,
			required: [true, 'Name is required'],
			min: 5
		},
		isDeleted: { type: Boolean, default: false }
	},
	{
		collection: 'rols',
		timestamps: true
	}
);

rolSchema.plugin(autoIncrement, { inc_field: 'rolId' });

export default mongoose.model('rol', rolSchema);
