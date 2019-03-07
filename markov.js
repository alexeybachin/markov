function Markov ( n, max ) {

    "use strict";

    this.n = parseInt( n ) || 2;
    this.max = parseInt( max ) || 100;
    this.ngrams = {};
    this.beginnings = [];
    this.analyzed = false;

    const tokenize = ( s ) => {
        return s.split(/\s+/);
    };

    const randomFromArray = ( a ) => {
        return a[ Math.floor( Math.random() * a.length ) ];
    };

    const prepareInput = ( input ) => {
        let lines = input.split( '\n' ),
            a = '';

        for ( let i = 0; i < lines.length; i++ ) {
            a += lines[i].trim();
        }

        return a;
    };

    this.analyze = ( input ) => {

        input = ( typeof input !== 'undefined' ) ? input : '';

        let tokens = tokenize( prepareInput( input ) );

        if ( tokens.length < this.n ) return false;

        if ( this.beginnings.length === 0 ) {
            let zero = tokens.slice( 0, this.n ).join( ' ' );
            this.beginnings.push( zero );
        }

        for ( let i = 0; i < tokens.length - this.n; i++ ) {

            let gram = tokens.slice( i, i + this.n ).join( ' ' ),
                next = tokens[i + this.n];

            this.ngrams[gram] = this.ngrams[gram] || [];

            this.ngrams[gram].push( next );

            if ( gram && gram[0].match( /[A-Z]/g ) ) {
                if ( !this.beginnings.includes( gram ) ) {
                    this.beginnings.push( gram );
                }
            }
        }

        return this.analyzed = true;

    };

    this.generate = () => {

        if ( !this.analyzed ) return 'Input is empty!';

        let current = randomFromArray( this.beginnings ),
            output = tokenize( current );

        for ( let i = 0; i < this.max; i++ ) {

            if ( this.ngrams[current] ) {

                let possible_next = this.ngrams[current],
                    next = randomFromArray( possible_next );

                output.push( next );
                current = output.slice( output.length - this.n, output.length ).join( ' ' );
            } else {
                break;
            }
        }

        output = output.join( ' ' );

        output = ( output.match( /\.$/g ) ) ? output : output + '.';

        return output;
    }
}
