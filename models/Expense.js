const mongoose=require('mongoose')
const {Schema,model}=mongoose;

const ExpenseSchema=new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    expense:{type:Number,required:true},
    datetime:{type:String,required:true},
    description:{type:String,required:true},
})

const ExpenseModel=model('Expense',ExpenseSchema);
module.exports=ExpenseModel;