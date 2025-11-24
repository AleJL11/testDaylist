import { useEffect, useState } from 'react';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function Home() {
    const [entries, setEntries] = useState([]);
    const [form, setForm] = useState({
        name: '',
        date: new Date().toISOString().slice(0,10),
        activity: '',
        hours: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch inicial
    useEffect(() => {
        fetchEntries();
    }, []);

    async function fetchEntries() {
        try {
            const res = await fetch(`${BACKEND_BASE}/api/daylists`);
            const data = await res.json();
            setEntries(data);
        } catch (err) {
            console.error(err);
            setError("No se pudo obtener registros desde el backend");
        }
    }

    // Maneja cambios del formulario
    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    // Envía el formulario al backend
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        // Validación en frontend
        if (!form.name.trim() || !form.activity.trim() || form.hours === '') {
            setError('Completa todos los campos obligatorios');
            return;
        }

        const payload = {
            name: form.name,
            date: form.date,
            activity: form.activity,
            hours: Number(form.hours)
        };

        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_BASE}/api/daylists`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al guardar');
            }

            const saved = await res.json();
            // Actualiza ID automatico
            setEntries(prev => [saved, ...prev]);
            // Limpiar formulario
            setForm({
                name: '',
                date: new Date().toISOString().slice(0,10),
                activity: '',
                hours: ''
            });
        } catch (err) {
            console.group("Error al registrar Daylist");
            console.error("Mensaje: ", err.message);
            if (err.response) console.log("Respuesta del backend: ", err.response);
            console.groupEnd();
            setError(err.message || 'Error en la petición');
            /*console.error(err);
            setError(err.message || 'Error en la petición');*/
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={styles.container}>
            <h1 style={styles.title}>Daylist - Bitácora diaria</h1>

            <section style={styles.card}>
                <h2>Registrar actividad</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Nombre del desarrollador
                        <input  name="name" value={form.name} onChange={handleChange} style={styles.input} required/>
                    </label>

                    <label style={styles.label}>
                        Fecha
                        <input type="date" name="date" value={form.date} onChange={handleChange} style={styles.input} required/>
                    </label>

                    <label style={styles.label}>
                        Actividad realizada
                        <textarea name="activity" value={form.activity} onChange={handleChange} rows="3" style={styles.input} required/>
                    </label>

                    <label style={styles.label}>
                        Tiempo invertido (horas)
                        <input type="number" name="hours" value={form.hours} onChange={handleChange} min="0" step="0.25" style={styles.input} required/>
                    </label>

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar registro'}
                    </button>
                </form>
            </section>

            <section style={{ ...styles.card, marginTop: 20}}>
                <h2>Registros</h2>
                <div style={{ marginBottom: 8 }}>
                    Total: <strong>{entries.length}</strong>
                </div>
                {entries.length === 0 ? (
                    <p>No hay registros aún.</p>
                ) : (
                    <ul style={styles.list}>
                        {entries.map(e => (
                            <li key={e.id} style={styles.listItem}>
                                <div style={{display:'flex', justifyContent: 'space-between', gap: 12}}>
                                    <div>
                                        <div style={{fontWeight: 700}}>{e.name} <span style={{fontWeight:400, color:'#666'}}>— {e.date}</span></div>
                                        <div style={{marginTop:6}}>{e.activity}</div>
                                        <div style={{marginTop:6, fontSize: 13, color:'#333'}}>Tiempo: {e.hours} h</div>
                                    </div>
                                    <div style={{textAlign:'right', fontSize:12, color:'#666'}}>Creado: {new Date(e.createdAt).toLocaleString()}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: '32px auto',
    padding: '0 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  title: {
    fontSize: 28,
    marginBottom: 12
  },
  card: {
    background: '#fff',
    padding: 18,
    borderRadius: 10,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
  },
  form: {
    display: 'grid',
    gap: 10
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 14
  },
  input: {
    marginTop: 6,
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ddd',
    fontSize: 14
  },
  button: {
    marginTop: 6,
    padding: '10px 14px',
    borderRadius: 8,
    background: '#0366d6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 10
  },
  listItem: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #eee',
    background: '#fafafa'
  },
  error: {
    color: 'white',
    background: '#e12d39',
    padding: 8,
    borderRadius: 6
  }
};
