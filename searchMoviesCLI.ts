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
    // console.log("[1]Search [2]See your favourites [3]Quit")
    // let option = question("Choose an action! [1,2,3]")
    // if (option === '1'){
        let searchTerm = question("Search term: ").toLowerCase()
        const text = "select id, name, date, runtime, budget, revenue, vote_average, votes_count from movies where LOWER(name) like $1 order by date desc limit 10";
        const values = [`%${searchTerm}%`];
        const res = await client.query(text, values);
        console.table(res.rows) // how to have them as list, and say 0 cancel 
    //     let favChoice = question("Choose a movie row number to favourite [1...8/0]: ")
    //     // insert the movie id to the favourites table 
    //     console.log("Saving favourite movie: ") //how to get the name of the film here 
    // }
    // if (option === '2'){
    //     console.log("Here are your saved favourites!")
    //     const res = await client.query("select ");// need query that joins favourites to casts_view
    // }
    // console.log("All done!")
    await client.end()
}
// }
connect()
