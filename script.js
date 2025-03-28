const supabaseUrl = 'https://tdvdhqhvzwqyvezunwwh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdmRocWh2endxeXZlenVud3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjg0MTksImV4cCI6MjA1ODcwNDQxOX0.pZ1GzHfUjZ1i1LI5bLZhAa_rtQk82O-9xkRKbQeQkfc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById("jugadorForm");
const tabla = document.getElementById("tabla-jugadores");

// Agregar nuevo jugador desde formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoJugador = {
    nombre: document.getElementById("nombre").value,
    horas_jugadas: Number(document.getElementById("horas_jugadas").value),
    decisiones_acosador: Number(document.getElementById("decisiones_acosador").value),
    decisiones_victima: Number(document.getElementById("decisiones_victima").value),
    decisiones_observador_pasivo: Number(document.getElementById("decisiones_observador_pasivo").value),
    decisiones_observador_activo: Number(document.getElementById("decisiones_observador_activo").value),
    final_obtenido: document.getElementById("final_obtenido").value,
    tiempo_decision: Number(document.getElementById("tiempo_decision").value),
    tiempo_mouse: Number(document.getElementById("tiempo_mouse").value),
  };

  const { error } = await supabase.from("base").insert([nuevoJugador]);
  if (error) {
    console.error("❌ Error al insertar:", error.message);
    return;
  }

  form.reset();
  cargarJugadores();
});

// Cargar todos los jugadores y mostrarlos en la tabla
async function cargarJugadores() {
  const { data, error } = await supabase.from("base").select("*");

  if (error) {
    console.error("❌ Error al cargar datos:", error.message);
    return;
  }

  tabla.innerHTML = "";
  data.forEach(j => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${j.nombre}</td>
      <td>${j.horas_jugadas}</td>
      <td>${j.decisiones_acosador}</td>
      <td>${j.decisiones_victima}</td>
      <td>${j.decisiones_observador_pasivo}</td>
      <td>${j.decisiones_observador_activo}</td>
      <td>${j.final_obtenido}</td>
      <td>${j.tiempo_decision}</td>
      <td>${j.tiempo_mouse}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarJugador(${j.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Eliminar jugador por ID
async function eliminarJugador(id) {
  const { error } = await supabase.from("base").delete().eq("id", id);
  if (error) {
    console.error("❌ Error al eliminar:", error.message);
    return;
  }
  cargarJugadores();
}

// Inicial: cargar tabla al abrir la página
cargarJugadores();

// 🎯 ESCUCHAR EN TIEMPO REAL: Se activa si un nuevo jugador llega desde el juego
supabase
  .channel('jugadores-stream')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'base'
    },
    (payload) => {
      console.log('📥 Nuevo jugador insertado desde el juego:', payload.new);
      cargarJugadores();
    }
  )
  .subscribe();
