drop table if exists favourites;

create table favourites (
  id serial primary key, 
  movie_id integer NOT NULL, 
  constraint movie_id_fk_constraint FOREIGN KEY (movie_id) REFERENCES MOVIES (ID)
);
