const supabaseUrl = 'https://tdvdhqhvzwqyvezunwwh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdmRocWh2endxeXZlenVud3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjg0MTksImV4cCI6MjA1ODcwNDQxOX0.pZ1GzHfUjZ1i1LI5bLZhAa_rtQk82O-9xkRKbQeQkfc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function cargarDatos() {
  const { data, error } = await supabase
    .from('base') // nombre de tu tabla
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.querySelector("#tablaDatos tbody");
  tbody.innerHTML = ""; // Limpiar antes de renderizar

  data.forEach(jugador => {
    const fila = `
      <tr>
        <td>${jugador.nombre}</td>
        <td>${jugador.puntos}</td>
        <td>
          <button onclick="eliminar(${jugador.id})">Eliminar</button>
        </td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

async function eliminar(id) {
  await supabase
    .from('jugadores')
    .delete()
    .eq('id', id);

  cargarDatos(); // Recargar datos luego de borrar
}

cargarDatos();
