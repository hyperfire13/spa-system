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
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");

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

  const categories = [
    "ALL",
    ...new Set(
        services.map(s => s.description).filter(Boolean)
    )
    ];

    const filteredServices = services
    .filter(service => {
        if (selectedCategory === "ALL") return true;

        return service.description === selectedCategory;
    })
    .sort((a, b) => {
        if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
        }

        return b.name.localeCompare(a.name);
    });

  if(loading) return <Loading/>;

  return (
    <div className="container-fluid">

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">

            <h4 className="text-warning mb-0">
                Services
            </h4>

            <div className="d-flex gap-2 flex-wrap">

                {/* FILTER */}
                <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                    width: "220px"
                }}
                >
                {categories.map(category => (
                    <option key={category} value={category}>
                    {category}
                    </option>
                ))}
                </select>

                {/* SORT */}
                <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                    width: "180px"
                }}
                >
                <option value="asc">
                    A → Z
                </option>

                <option value="desc">
                    Z → A
                </option>
                </select>

                <button
                className="btn btn-warning"
                onClick={openCreate}
                >
                + Add Service
                </button>

            </div>

        </div>

        <div className="card bg-dark p-3">

            {services.length===0 && (
            <div className="text-center text-secondary">
                No services created yet.
            </div>
            )}

            {filteredServices.map(s=>(
            <div key={s.id} className="border-bottom py-3 d-flex justify-content-between align-items-center">

                <div>
                    <div className="text-warning fw-semibold fs-5">
                        {s.name}
                    </div>
                    <div
                        className="small text-uppercase mb-1"
                        style={{
                        color: "#C7B88A",
                        letterSpacing: "1px"
                        }}
                    >
                        {s.description || "UNCATEGORIZED"}
                    </div>
                    <small className="text-secondary">
                        £{s.price} • {s.duration_minutes} mins • {s.is_active ? "Active" : "Hidden"}
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
                <div className="modal-content bg-dark  text-white">

                <div className="modal-header">
                    <h5 className="text-warning">
                    {editing ? "Edit Service" : "Create Service"}
                    </h5>
                    <button className="btn-close btn-close-white" onClick={closeForm}/>
                </div>

                <form onSubmit={submit}>
                    <div className="modal-body">

                        {error.length > 0 && (
                            <div className="alert alert-danger">
                            <ul className="mb-0">
                                {error.map((e, i) => (
                                <li key={i}>{e}</li>
                                ))}
                            </ul>
                            </div>
                        )}

                        {/* NAME */}
                        <div className="mb-3">
                            <label className="form-label text-warning">
                            Service Name
                            </label>

                            <input
                            className="form-control"
                            placeholder="Enter service name"
                            value={form.name}
                            onChange={e => setForm({
                                ...form,
                                name: e.target.value
                            })}
                            />
                        </div>

                        {/* DESCRIPTION / CATEGORY */}
                        <div className="mb-3">
                            <label className="form-label text-warning">
                            Category
                            </label>

                            <select
                            className="form-select"
                            value={form.description || ""}
                            onChange={e => setForm({
                                ...form,
                                description: e.target.value
                            })}
                            >
                            <option value="">
                                Select category
                            </option>

                            <option value="FACIALS">
                                Facials
                            </option>

                            <option value="SKIN BOOSTERS">
                                Skin Boosters
                            </option>

                            <option value="FACIAL TREATMENT">
                                Facial Treatment
                            </option>

                            <option value="SEMI PERMANENT MAKEUP (SPMU)">
                                Semi Permanent Makeup (SPMU)
                            </option>

                            <option value="JAPANESE HEAD SPA">
                                Japanese Head Spa
                            </option>

                            <option value="MASSAGE FOR THE BODY">
                                Massage For The Body
                            </option>

                            <option value="SPA FOR YOUR FOOT">
                                Spa For Your Foot
                            </option>
                            </select>
                        </div>

                        {/* PRICE */}
                        <div className="mb-3">
                            <label className="form-label text-warning">
                            Price (£)
                            </label>

                            <input
                            type="number"
                            className="form-control"
                            placeholder="Enter price"
                            value={form.price}
                            onChange={e => setForm({
                                ...form,
                                price: e.target.value
                            })}
                            />
                        </div>

                        {/* DURATION */}
                        <div className="mb-3">
                            <label className="form-label text-warning">
                            Duration (Minutes)
                            </label>

                            <input
                            type="number"
                            className="form-control"
                            placeholder="Enter duration"
                            value={form.duration_minutes}
                            onChange={e => setForm({
                                ...form,
                                duration_minutes: e.target.value
                            })}
                            />
                        </div>

                        {/* ACTIVE */}
                        <div className="form-check mb-4">
                            <input
                            type="checkbox"
                            className="form-check-input"
                            checked={form.is_active}
                            onChange={e => setForm({
                                ...form,
                                is_active: e.target.checked
                            })}
                            />

                            <label className="form-check-label">
                            Active Service
                            </label>
                        </div>

                        <h6 className="text-warning mt-3 mb-3">
                            Schedules
                        </h6>

                        {form.schedules.map((s, i) => (
                            <div
                            key={i}
                            className="border rounded p-3 mb-3"
                            >

                            <div className="row g-2 text-warning">

                                <div className="col-6">
                                <label className="form-label small">
                                    Day
                                </label>

                                <select
                                    className="form-select"
                                    value={s.day_of_week}
                                    onChange={e =>
                                    updateSchedule(i, 'day_of_week', e.target.value)
                                    }
                                >
                                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => (
                                    <option key={idx} value={idx}>
                                        {d}
                                    </option>
                                    ))}
                                </select>
                                </div>

                                <div className="col-6 d-flex align-items-end">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger w-100"
                                    onClick={() => removeSchedule(i)}
                                >
                                    Remove
                                </button>
                                </div>

                                <div className="col-6">
                                <label className="form-label small">
                                    Start Time
                                </label>

                                <input
                                    type="time"
                                    className="form-control"
                                    value={s.start_time}
                                    onChange={e =>
                                    updateSchedule(i, 'start_time', e.target.value)
                                    }
                                />
                                </div>

                                <div className="col-6">
                                <label className="form-label small">
                                    End Time
                                </label>

                                <input
                                    type="time"
                                    className="form-control"
                                    value={s.end_time}
                                    onChange={e =>
                                    updateSchedule(i, 'end_time', e.target.value)
                                    }
                                />
                                </div>

                                <div className="col-6">
                                <label className="form-label small">
                                    Slot Minutes
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={s.slot_minutes}
                                    onChange={e =>
                                    updateSchedule(i, 'slot_minutes', e.target.value)
                                    }
                                />
                                </div>

                                <div className="col-6">
                                <label className="form-label small">
                                    Capacity
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={s.capacity_per_slot}
                                    onChange={e =>
                                    updateSchedule(i, 'capacity_per_slot', e.target.value)
                                    }
                                />
                                </div>

                            </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-warning w-100"
                            onClick={addSchedule}
                        >
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
