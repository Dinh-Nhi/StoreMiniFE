// src/shared/components/SearchModal.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      // Close modal
      const modal = document.getElementById('searchModal');
      if (modal) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    }
  };

  return (
    <div className="modal fade" id="searchModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content rounded-0">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Search by keyword</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex align-items-center">
            <form onSubmit={handleSearch} className="input-group w-75 mx-auto d-flex">
              <input 
                type="search" 
                className="form-control p-3" 
                placeholder="keywords" 
                aria-describedby="search-icon-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                id="search-icon-1" 
                className="input-group-text p-3 btn btn-primary"
              >
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
