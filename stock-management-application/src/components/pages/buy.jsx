import React from "react"
import buy from "../../assets/buy.png"
    

const Buy = () =>{
    return (  
        <>
            <div className="col-span-2 row-span-3 mt-5 ">
                <form action="" className="w-full h-full flex-col justify-center items-center pl-10 ">
                    <h1 className="md:text-4xl text-3xl font-bold">Buy Now</h1>
                    <p className="text-xs pt-3 pb-7">Small purchase makes a big difference</p>
                    <label htmlFor="" className="text-xs pt-28">Product ID</label><br />
                    <select className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72">
                        <option value="Aluminium-sheet">Aluminium sheet: 001</option>
                        <option value="Aluminium-palte">Aluminium Plate: 002</option>
                        <option value="Rail">Rail: 003</option>
                    </select><br />
                    <label htmlFor="" className="text-xs pt-28">Quantity</label><br />
                    <input type="number" name="" id=""
                     className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72" /><br />
                    <label htmlFor="" className="text-xs pt-28">Date</label><br />
                    <input type="date" name="" id=""
                    className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72" /><br />
                    <label htmlFor="" className="text-xs pt-28">Description</label><br />
                    <input type="text" name="" id=""
                    className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72" /><br />
                    <label htmlFor="" className="text-xs pt-28">Unit price</label><br />
                    <input type="number" name="" id=""
                    className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72" /><br />
                    <button type="submit" className="rounded-full bg-mybtn md:w-80 w-72 my-4 py-2.5 text-xs font-bold ">Submit</button><br />
                </form>
            </div>
            <div className="col-span-2 row-span-3 mt-5">
                <img src={buy} alt="kermen logo" className="w-2/3 pl-10 pt-20" />
            </div>
        </>
    )
}

export default Buy