import { question } from "readline-sync";
import { Client } from "pg";


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: 'omdb' });
console.log("Welcome to search-movies-cli!")
;
async function connect(){
    await client.connect()
    while(true){
    console.log("[1]Search [2]See your favourites [3]Quit")
    let option = question("Choose an action! [1,2,3]")
    if (option === '1'){
        let searchTerm = question("Search term: ").toLowerCase()
        const searchQuery = "select id, name, date, runtime, budget, revenue, vote_average, votes_count from movies where LOWER(name) like $1 order by date desc limit 10";
        const values = [`%${searchTerm}%`];
        const res = await client.query(searchQuery, values);
        console.table(res.rows) 
        let i =0
        for (let item of res.rows){
             i += 1
            console.log(`[${i}] ${item.name}`)
        }
        console.log("[0] Cancel")
        let favChoice = question(`Choose a movie row number to favourite [1...${res.rows.length}/0]: `)
        if (favChoice === '0'){
            continue
        }
        else{
        let favChoiceNum: number  = parseInt(favChoice)-1
        const favMovieId = res.rows[favChoiceNum].id
        const check = await client.query("select id from favourites where movie_id = $1", [favMovieId])
        if (check.rowCount>0){
            console.log(`You have already added ${res.rows[favChoiceNum].name} to your favourites list`)
            continue
        }
        else{
        const favAddQuery = "insert into favourites(movie_id) values ($1)"
        const movieId = [`${favMovieId}`]
        const result = await client.query(favAddQuery, movieId)
        console.log("Saving favourite movie: ", res.rows[favChoiceNum].name) 
        }
        }
    }
    if (option === '2'){
        console.log("Here are your saved favourites!")
        const res = await client.query("select movies.id, name, date, runtime, budget, revenue, vote_average, votes_count from movies join favourites on movies.id = favourites.movie_id");
        console.table(res.rows)
    }
    if (option === '3'){
        console.log("All done!")
        await client.end()
        break
    }
}}
connect()
