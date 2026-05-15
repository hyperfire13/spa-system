import { useEffect, useState } from "react";
import api from "../lib/api";
import Loading from "../components/Loading";

export default function AdminServices() {

  const emptySchedule = {
    day_of_week: 1,
    start_time: "09:00",
    end_time: "18:00",
    slot_minutes: 60,
    capacity_per_slot: 1
  };

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    duration_minutes: 60,
    is_active: true,
    schedules:[{...emptySchedule}]
  };

  const [services,setServices] = useState([]);
  const [loading,setLoading] = useState(false);
  const [initialized,setInitialized] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState([]);
  const [showForm,setShowForm] = useState(false);
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState(emptyForm);
  const [page,setPage] = useState(1);
  const [lastPage,setLastPage] = useState(1);

  const addSchedule = ()=>{
    setForm(f=>({...f,schedules:[...f.schedules,{...emptySchedule}]}));
  };

  const removeSchedule = i=>{
    setForm(f=>({...f,schedules:f.schedules.filter((_,x)=>x!==i)}));
  };

  const updateSchedule = (i,key,value)=>{
    setForm(f=>{
      const copy=[...f.schedules];
      copy[i]={...copy[i],[key]:value};
      return {...f,schedules:copy};
    });
  };


  /* ================= LOAD ================= */

  const load = async (p = page)=>{
    try{
      setLoading(true);

      const res = await api.get("/admin/services",{
        params:{ page:p }
      });
      console.log(res.data.last_page + 'xx');
      setServices(res.data.data);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);

    }catch(e){
      setError(["Failed to load services"]);
      alert(e)
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
            <div className="modal-content  text-white">

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

                  <h6 className="gold-text mt-3">Schedules</h6>

                  {form.schedules.map((s,i)=>(
                    <div key={i} className="border rounded p-2 mb-2">

                      <div className="row g-2">

                        <div className="col-6">
                          <select className="form-select"
                            value={s.day_of_week}
                            onChange={e=>updateSchedule(i,'day_of_week',e.target.value)}>
                            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,idx)=>(
                              <option key={idx} value={idx}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-6">
                          <button type="button" className="btn btn-sm btn-danger w-100"
                            onClick={()=>removeSchedule(i)}>Remove</button>
                        </div>

                        <div className="col-6">
                          <input type="time" className="form-control"
                            value={s.start_time}
                            onChange={e=>updateSchedule(i,'start_time',e.target.value)}/>
                        </div>

                        <div className="col-6">
                          <input type="time" className="form-control"
                            value={s.end_time}
                            onChange={e=>updateSchedule(i,'end_time',e.target.value)}/>
                        </div>

                        <div className="col-6">
                          <input type="number" className="form-control" placeholder="Slot Minutes"
                            value={s.slot_minutes}
                            onChange={e=>updateSchedule(i,'slot_minutes',e.target.value)}/>
                        </div>

                        <div className="col-6">
                          <input type="number" className="form-control" placeholder="Capacity"
                            value={s.capacity_per_slot}
                            onChange={e=>updateSchedule(i,'capacity_per_slot',e.target.value)}/>
                        </div>

                      </div>
                    </div>
                  ))}

                  <button type="button" className="btn btn-outline-warning w-100"
                    onClick={addSchedule}>
                    + Add Schedule
                  </button>
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
