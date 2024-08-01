import React from "react"
import Card from "../Card"     
import Card2 from "../Card2"    

const Home = () =>{
    return (  
        <>
            <div className="col-span-1 row-span-1 mt-5">
                <Card name={'Sales'} value={'$2000'}/>
            </div>
            <div className="col-span-1 row-span-1 mt-5">
                <Card name={'Number of Sales'} value={'200'}/>
            </div>
            <div className="col-span-1 row-span-1 mt-5">
                <Card name={'Purchase'} value={'$2,000'}/>
            </div>
            <div className="col-span-1 row-span-1 mt-5">
                <Card name={'Number of Purchase'} value={'200'}/>
            </div>

            <div className="col-span-2 row-span-1"><Card2 /></div>
            <div className="col-span-2 row-span-1">Chart 1</div>
  
            <div className="col-span-2 row-span-1">Chart 2</div>
            <div className="col-span-2 row-span-1">Chart 3</div>
        </>
    )
}

export default Home