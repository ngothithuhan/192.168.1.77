import React from 'react'
import NumberFormat from 'react-number-format';
class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    
    render() {
        let {decimalScale,disabled,onValueChange,className,displayType,value,thousandSeparator,prefix,id}=this.props;
        return (
            displayType !=='text'?
            <NumberFormat className={className?className:''} 
            value={value}
            onValueChange={onValueChange} 
            thousandSeparator={thousandSeparator?thousandSeparator:false} 
            prefix={prefix?prefix:''} 
            disabled={disabled?disabled:false}
            decimalScale={decimalScale?decimalScale:0}
            prefix=''
            id={id?id:"txtNumberInput"} />
            :
            <NumberFormat className={className?className:''} 
            displayType='text' 
            value={parseFloat(value?value:0)} 
            thousandSeparator={thousandSeparator?thousandSeparator:false} 
            prefix={prefix?prefix:''} 
            disabled={disabled?disabled:false}
            decimalScale={decimalScale?decimalScale:0}
             id={id?id:"txtNumberInput"} 
            />
        )
    }
}

export default NumberInput;