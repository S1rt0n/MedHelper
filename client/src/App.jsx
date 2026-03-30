import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  // 1. ПЕРЕМЕННЫЕ ХРАНИЛИЩА (State)
  const [faculties, setFaculties] = useState([])
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null) // Выбранный предмет
  const [books, setBooks] = useState([]) // Список книг для предмета

  // 2. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
  useEffect(() => {
    axios.get('https://medhelper-production.up.railway.app/faculties').then(res => setFaculties(res.data))
  }, [])

  const loadSubjects = (fId, cId) => {
    axios.get(`https://medhelper-production.up.railway.app/subjects/${fId}/${cId}`).then(res => setSubjects(res.data))
  }

  const loadBooks = (sId) => {
    axios.get(`https://medhelper-production.up.railway.app/books/${sId}`).then(res => setBooks(res.data))
  }

  // 3. СТИЛИ (Дизайн)
  const appStyle = {
    padding: '50px 20px',
    textAlign: 'center',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    backgroundColor: '#f4fbf9',
    minHeight: '100vh'
  }

  const subjectsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
    gap: '20px',
    marginTop: '30px',
    width: '100%'
  }

  const subjectCardStyle = {
    padding: '20px 25px',
    background: '#fff',
    borderLeft: '8px solid #009688',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'left',
    fontSize: '19px',
    fontWeight: '900', // Жирный шрифт
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  }

  const backBtnStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    background: 'white',
    border: '2px solid #b2dfdb',
    color: '#00796b',
    borderRadius: '10px',
    fontWeight: 'bold',
    marginBottom: '20px'
  }

  // 4. ОТОБРАЖЕНИЕ (Интерфейс)
  return (
    <div style={appStyle}>
      <h1 style={{ color: '#00695c', fontSize: '36px', fontWeight: '900',minHeight: '100vh' }}> MedHelper</h1>

    {/* ЭКРАН 1: ПРИВЕТСТВИЕ И ФАКУЛЬТЕТЫ */}
      {!selectedFaculty && (
        <>
         <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '20px', maxWidth: '700px', margin: '40px auto 0 auto', border: '1px solid #e0f2f1' }}>
      <p style={{ fontSize: '16px', fontWeight: '600', color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
        "Я анонимный автор решил помочь студентам медикам с быстрым поиском информации для ваших пар. Я надеюсь на хорошее сотрудничество с вами."
      </p>
    </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {faculties.map(f => (
              <button key={f.id} onClick={() => setSelectedFaculty(f)} 
                style={{ padding: '18px 30px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4db6ac 0%, #009688 100%)', color: 'white' }}>
                {f.name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ЭКРАН 2: ВЫБОР КУРСА */}
      {selectedFaculty && !selectedCourse && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => setSelectedFaculty(null)} style={backBtnStyle}>⬅ Назад</button>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '30px', border: '1px solid #e0f2f1' }}>
            <h2 style={{ fontWeight: '900', color: '#004d40', fontSize: '28px' }}>{selectedFaculty.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button key={num} onClick={() => { setSelectedCourse(num); loadSubjects(selectedFaculty.id, num); }} 
                  style={{ padding: '30px 20px', borderRadius: '20px', border: '3px solid #b2dfdb', background: '#fff', cursor: 'pointer', fontSize: '24px', fontWeight: '900', color: '#00796b' }}>
                  {num} курс
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ПРЕДМЕТЫ И КНИГИ */}
      {selectedCourse && (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => { setSelectedCourse(null); setSubjects([]); setSelectedSubject(null); }} style={backBtnStyle}>⬅ К курсам</button>
          
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '30px', border: '1px solid #e0f2f1', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#00695c', fontWeight: '900', marginBottom: '0' }}>{selectedFaculty.name}</h2>
            <p style={{ color: '#888', fontSize: '20px', fontWeight: '900' }}>{selectedCourse} курс</p>
            
            <div style={subjectsGridStyle}>
              {subjects.map(s => (
                <div key={s.id} style={subjectCardStyle} 
                     onClick={() => { setSelectedSubject(s); loadBooks(s.id); }}
                     onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <span style={{ fontSize: '24px' }}>📘</span> {s.name}
                </div>
              ))}
            </div>

            {/* СПИСОК КНИГ (появляется внизу при нажатии на предмет) */}
            {selectedSubject && (
              <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#f0fdfa', borderRadius: '25px', border: '3px dashed #b2dfdb' }}>
                <h3 style={{ fontWeight: '900', color: '#00695c', marginBottom: '20px' }}>📚 Материалы по: {selectedSubject.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {books.length > 0 ? books.map(b => (
                    <a key={b.id} href={b.url} target="_blank" rel="noreferrer" 
                       style={{ padding: '20px', background: '#fff', borderRadius: '15px', textDecoration: 'none', color: '#00796b', fontWeight: '900', border: '1px solid #b2dfdb', fontSize: '18px' }}>
                      📖 {b.title}
                    </a>
                  )) : <p style={{fontWeight: '900', color: '#888'}}>Материалы скоро появятся...</p>}
                  <button onClick={() => setSelectedSubject(null)} style={{ marginTop: '10px', padding: '10px', cursor: 'pointer', background: '#ffab91', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>Закрыть</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
