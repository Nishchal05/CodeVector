import { useContext, useRef } from "react";
import { CategoryContext } from "../context";

type PaginationProps={
    firstitem:number;
    lastitem:number;
    setprevlistid:React.Dispatch<React.SetStateAction<number>>;
}
export default function pagination({firstitem,lastitem,setprevlistid}:PaginationProps){
   
    const context=useContext(CategoryContext);
    if (!context) {
        throw new Error("Navbar must be used within a Context provider");
    }
    const {currentPage,setCurrentPage,setnextlistid}=context;
    let listing=[];
    for(let i=currentPage*20;i<=currentPage*20+19;i++){
        if(i<currentPage*20+7){
        listing.push(i);
    } 
    else if(currentPage*20+7<= i && i<currentPage*20+13){
        listing.push("...")
    }
    else if(currentPage*20+13<= i && i<=currentPage*20+19){
        listing.push(i)
    }
    }
    return(
        <section className="w-full flex justify-center p-2">
            <button className="bg-gray-900 text-white p-3 rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 active:scale-95"   disabled={currentPage===0} onClick={()=>{
                setCurrentPage(currentPage-1);
                setprevlistid(firstitem);
                setnextlistid(0);
            }}>
                Previous
            </button>
            {listing.map((item:any,index:number)=>{
                return(
                    <button key={index} className="bg-gray-900 text-white p-3 rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 active:scale-95">
                        {item}
                    </button>
                )
            })}
            <button className="bg-gray-900 text-white p-3 rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 active:scale-95" onClick={()=>{
                setCurrentPage(currentPage+1);
                setnextlistid(lastitem);
                setprevlistid(0);
            }}>
                Next
            </button>
        </section>
    )
}