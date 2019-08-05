class Maths {
    constructor() {

    }

    minimuimSwaps(arr, order){
        var swap = 0;
        var checked = [];
        var counter = 0;
        var final = [...arr].sort((a, b)=>{return a-b});
        if(order == -1) final = final.reverse();
    
        for(var i=0; i<arr.length; i++){
            var element = arr[i];
            if(i == element || checked[i]) continue;
    
            counter = 0;
    
            if(arr[0] == 0) element = i;
    
            while(!checked[i]){
                checked[i] = true;
                i = final.indexOf(element);
                element = arr[i];
                counter++;
            }
            if(counter != 0){
                swap += counter - 1;
            }
        }
        return swap;
    }

    primeFactorize(number) {
        if (typeof number != "number") return [];
        number = parseInt(number);
        if (number == 1 || number == 0) return []
        var divider = 2;
        var dividend;
        var factors = [];
        while (number != 1) {
            dividend = number / divider;
            if (dividend.toString().indexOf('.') != -1) {
                divider++
                continue;
            }
            number = dividend;
            factors.push(divider);
        }
        return factors;
    }

    LCF(numbers) {
        if (!Array.isArray(numbers)) return [];
        var factors = [];
        var commonFactors = [];
        var value = 1;
        for (var number of numbers) {
            if (typeof number != "number") return [];
            factors.push(this.primeFactorize(number))
        }

        main:
        for (var factor of factors[0]) {
            if (commonFactors.indexOf(factor) == -1) {
                for (var i of factors) {
                    if (i.indexOf(factor) == -1) continue main;
                }
                commonFactors.push(factor);
                value *= factor;
            }
        }
        return value;
    }

    LCM(numbers) {
        if (!Array.isArray(numbers)) return [];
        var factors;
        var multiples = {};
        var value = 1;
        for (var number of numbers) {
            if (typeof number != "number") return [];
            var f = [];
            factors = this.primeFactorize(number);
            for (var factor of factors) {
                if (f.indexOf(factor) == -1) {
                    f.push(factor);
                    if (!bFunc.isset(multiples[factor])) {
                        multiples[factor] = bFunc.countChar(factors, factor);
                    } else {
                        multiples[factor] = (multiples[factor] > bFunc.countChar(factors, factor)) ? multiples[factor] : bFunc.countChar(factors, factor);
                    }
                }
            }
        }
        Object.keys(multiples).map((key) => {
            value = value * (key ** multiples[key]);
        });

        return value;
    }

    HCF(numbers) {
        if (!Array.isArray(numbers)) return [];
        var factors = [];
        var commonFactors = {};
        var value = 1;
        for (var number of numbers) {
            if (typeof number != "number") return [];
            factors.push(this.primeFactorize(number))
        }

        main:
        for (var factor of factors[0]) {
            if (!bFunc.isset(commonFactors[factor])) {
                commonFactors[factor] = bFunc.countChar(factors[0], factor);
                for (var i of factors) {
                    commonFactors[factor] = (commonFactors[factor] < bFunc.countChar(i, factor)) ? commonFactors[factor] : bFunc.countChar(i, factor);
                }
            }
        }
        Object.keys(commonFactors).map((key) => {
            value = value * (key ** commonFactors[key]);
        });

        return value;
    }

    stripInteger(number){
        number = number.toString();
        number = (number.indexOf('.') == -1)?number:number.slice(0, number.indexOf('.'));
        return number;
    }

    stripFraction(number){
        number = number.toString();
        number = (number.indexOf('.') == -1)?'0':number.slice(number.indexOf('.') + 1);
        return number;
    }

    changeBase(params) {
        var list = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (!bFunc.isset(params.number)) return 'no_number';
        if (!bFunc.isset(params.from) && !bFunc.isset(params.to)) return { '10': params.number };
        if ((params.from || params.to) == 1) return 'base1 invalid';


        if (!bFunc.isset(params.from)) params.from = 10;
        if (!bFunc.isset(params.to)) params.to = 10;

        var symbol;
        var base10 = '';
        var baseTo = '';
        var baseToInteger = '';
        var baseToFraction = '';
        var integer = this.stripInteger(params.number)
        var integerValue = integer;

        var fraction = this.stripFraction(params.number);
        var fractionValue = fraction;
        for (var n of params.number) {
            symbol = list.indexOf(n);
            if (symbol >= params.from && n != '.') return 'invalid';
        }

        if (params.from != 10) {
            //convert to base10
            integerValue = 0;
            fractionValue = 0;
            for (var n in integer) {
                symbol = list.indexOf(integer[n]);
                integerValue = (symbol / 1 + integerValue);
                if (n != integer.length - 1) integerValue *= params.from;
            }

            for (var n in fraction) {
                symbol = list.indexOf(fraction[n]);
                fractionValue = (symbol / 1 + fractionValue);
                if (n != fraction.length - 1) fractionValue *= params.from;
            }
        }

        base10 = integerValue+fractionValue/(params.from**fraction.length);

        if(params.to == 10) return base10;
        while(integerValue/1){
            baseToInteger += list[integerValue%params.to];
            integerValue = this.stripInteger(integerValue/params.to);
        }
        var i = 4;
        while(i){
            fractionValue = ('.'+fractionValue)*params.to;
            baseToFraction += list[this.stripInteger(fractionValue)];
            fractionValue = this.stripFraction(fractionValue);
            i--;
        }
        baseTo = bFunc.flip(baseToInteger)+'.'+baseToFraction;
        return baseTo;
    }
}

module.exports = Maths;