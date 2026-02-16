import { useEffect, useState } from "react";
import api from "../lib/api";
import Loading from "../components/Loading";

export default function AdminServices() {

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    duration_minutes: 60,
    is_active: true
  };

  const [services,setServices] = useState([]);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState([]);
  const [showForm,setShowForm] = useState(false);
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState(emptyForm);
  const [page,setPage] = useState(1);
  const [lastPage,setLastPage] = useState(1);


  /* ================= LOAD ================= */

  const load = async (p = page)=>{
    try{
      setLoading(true);

      const res = await api.get("/admin/services",{
        params:{ page:p }
      });

      setServices(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);

    }catch{
      setError(["Failed to load services"]);
    }finally{
      setLoading(false);
    }
  };


  useEffect(()=>{ load(page); },[page]);


  /* ================= FORM ================= */

  const openCreate = ()=>{
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError([]);
  };

  const openEdit = svc=>{
    setEditing(svc);
    setForm({...svc});
    setShowForm(true);
    setError([]);
  };

  const closeForm = ()=>{
    setShowForm(false);
  };

  const submit = async e=>{
    e.preventDefault();
    setSaving(true);
    setError([]);

    try{
      if(editing){
        await api.put(`/admin/services/${editing.id}`,form);
      }else{
        await api.post(`/admin/services`,form);
      }

      closeForm();
      load(page);

    }catch(e){
      const errs = e.response?.data?.errors;
      if(errs){
        setError(Object.values(errs).flat());
      }else{
        setError(["Failed to save service"]);
      }
    }finally{
      setSaving(false);
    }
  };

  const remove = async id=>{
    if(!confirm("Delete this service?")) return;

    await api.delete(`/admin/services/${id}`);
    load(page);
  };

  /* ================= UI ================= */

  if(loading) return <Loading/>;

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between mb-3">
        <h4 className="gold-text">Services</h4>
        <button className="btn btn-warning" onClick={openCreate}>
          + Add Service
        </button>
      </div>

      <div className="card bg-dark p-3">

        {services.length===0 && (
          <div className="text-center text-secondary">
            No services created yet.
          </div>
        )}

        {services.map(s=>(
          <div key={s.id} className="border-bottom py-3 d-flex justify-content-between align-items-center">

            <div>
              <div className="gold-text fw-semibold">{s.name}</div>
              <small className="text-secondary">
                ₱{s.price} • {s.duration_minutes} mins • {s.is_active ? "Active" : "Hidden"}
              </small>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-warning" onClick={()=>openEdit(s)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(s.id)}>Delete</button>
            </div>

          </div>
        ))}
        <div className="d-flex justify-content-center mt-3 gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page===1}
            onClick={()=>setPage(p=>p-1)}
          >
            Prev
          </button>

          <span className="text-secondary align-self-center">
            Page {page} of {lastPage}
          </span>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page===lastPage}
            onClick={()=>setPage(p=>p+1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL FORM */}

      {showForm && (
        <div className="modal d-block" style={{background:"rgba(0,0,0,.6)"}}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">

              <div className="modal-header">
                <h5 className="gold-text">
                  {editing ? "Edit Service" : "Create Service"}
                </h5>
                <button className="btn-close btn-close-white" onClick={closeForm}/>
              </div>

              <form onSubmit={submit}>
                <div className="modal-body">

                  {error.length>0 && (
                    <div className="alert alert-danger">
                      <ul className="mb-0">
                        {error.map((e,i)=><li key={i}>{e}</li>)}
                      </ul>
                    </div>
                  )}

                  <input className="form-control mb-2" placeholder="Name"
                    value={form.name}
                    onChange={e=>setForm({...form,name:e.target.value})}/>

                  <textarea className="form-control mb-2" placeholder="Description"
                    value={form.description||""}
                    onChange={e=>setForm({...form,description:e.target.value})}/>

                  <input type="number" className="form-control mb-2" placeholder="Price"
                    value={form.price}
                    onChange={e=>setForm({...form,price:e.target.value})}/>

                  <input type="number" className="form-control mb-2" placeholder="Duration Minutes"
                    value={form.duration_minutes}
                    onChange={e=>setForm({...form,duration_minutes:e.target.value})}/>

                  <div className="form-check">
                    <input type="checkbox" className="form-check-input"
                      checked={form.is_active}
                      onChange={e=>setForm({...form,is_active:e.target.checked})}/>
                    <label className="form-check-label">Active</label>
                  </div>

                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeForm}>Cancel</button>
                  <button className="btn btn-warning" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
