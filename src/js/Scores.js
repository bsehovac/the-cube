class Scores {

  constructor( game ) {

    this.game = game;

    this.scores = [];
    this.solves = 0;
    this.best = 0;
    this.worst = 0;

  }

  addScore( time ) {

    this.scores.push( time );
    this.solves++;

    if ( this.scores.lenght > 100 ) this.scores.shift();

    let bestTime = false    

    if ( time < this.best || this.best === 0 ) {

      this.best = time;
      bestTime = true;

    }

    if ( time > this.worst ) this.worst = time;

    this.game.storage.saveScores();

    return bestTime;

  }

  calcStats() {

    this.setStat( 'total-solves', this.solves );
    this.setStat( 'best-time', this.convertTime( this.best ) );
    this.setStat( 'worst-time', this.convertTime( this.worst ) );
    this.setStat( 'average-5', this.getAverage( 5 ) );
    this.setStat( 'average-12', this.getAverage( 12 ) );
    this.setStat( 'average-25', this.getAverage( 25 ) );

  }

  setStat( name, value ) {

    if ( value === 0 ) return;

    this.game.dom.stats.querySelector( `.stats[name="${name}"] b` ).innerHTML = value;

  }

  getAverage( count ) {

    if ( this.scores.length < count ) return 0;

    return this.convertTime( this.scores.slice(-count).reduce( ( a, b ) => a + b, 0 ) / count );

  }

  convertTime( time ) {

    if ( time <= 0 ) return 0;

    const seconds = parseInt( ( time / 1000 ) % 60 );
    const minutes = parseInt( ( time / ( 1000 * 60 ) ) );

    return minutes + ':' + ( seconds < 10 ? '0' : '' ) + seconds;

  }

}

export { Scores };
