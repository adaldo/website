class Vector {

  constructor( x=0, y=0 ) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  add( other ) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  neg() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  sub( other ) {
    return this.add( other.clone().neg() );
  }

  mul( scalar ) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div( scalar ) { return this.mul( 1/scalar ); }

  dot( other ) {
    return this.x*other.x + this.y*other.y;
  }

  cross( other ) {
    return this.x*other.y - this.y*other.x;
  }

  get normSquared() {
    return this.dot(this);
  }

  get norm() {
    return Math.sqrt( this.normSquared );
  }

  get normalized() {
    return this.div( this.norm );
  }

  rotate( angle ) {
    this.x = this.x*Math.cos(angle) - this.y*Math.sin(angle);
    this.y = this.x*Math.sin(angle) + this.y*Math.cos(angle);
    return this;
  }

  rectBound(xmin,xmax,ymin,ymax) {
    if (this.x>xmax) this.x = xmax;
    else if (this.x<xmin) this.x = xmin;
    if (this.y>ymax) this.y = ymax;
    else if (this.y<ymin) this.y = ymin;
    return this;
  }

};
