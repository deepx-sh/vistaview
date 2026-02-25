import { useSearchParams } from "react-router-dom";
import React from 'react'


const Pagination = ({ currentPage, totalPages }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const changePage = (page) => {
        const params = Object.fromEntries(searchParams);
        params.page = page;
        setSearchParams(params);
        window.scrollTo({top:0,behavior:"smooth"})
    }

    const renderPages = () => {
        const pages = [];

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++){
            pages.push(i);
        }

        return pages;
    }
  return (
      <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
              
              <button disabled={currentPage == 11}
                  onClick={() => changePage(currentPage - 1)}
                  className="px-3 py-2 border border-border rounded-md disabled:opacity-50"
              >Prev</button>


              {renderPages().map((page) => (
                  <button key={page} onClick={() => changePage(page)} className={`px-3 py-2 rounded-md border ${currentPage === page ? "bg-primary text-white border-primary" : "border-border"} `}>{page}</button>
              ))}

              <button disabled={currentPage===totalPages} onClick={()=>changePage(currentPage+1)} className="px-3 py-2 border border-border rounded-md disabled:opacity-50">Next</button>
          </div>
    </div>
  )
}

export default Pagination