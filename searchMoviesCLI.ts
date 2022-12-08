import { question } from "readline-sync";
import { Client } from "pg";


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: 'omdb' });
console.log("Welcome to search-movies-cli!")
;
// https://stackoverflow.com/questions/61394928/get-user-input-through-node-js-console for input 
async function connect(){
    await client.connect()
    let searchTerm = question("What film do you want to search for?(or 'q' to quit)").toLowerCase()
    const text = "select movie_id, movie_name, date, runtime, budget, revenue, vote_average, votes_count from casts_view where movie_name like $1";
    const values = [`%${searchTerm}%`];
    if (searchTerm!="q"){
        const res = await client.query(text, values);
        console.table(res.rows)
    }
    await client.end()
}
connect()
