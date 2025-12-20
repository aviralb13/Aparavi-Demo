import './App.css'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setResult(null)
    setError('')
  }

  const parseAnswer = (rawText) => {
    const classification =
      rawText.match(/\*\*Classification:\s*(.*?)\*\*/)?.[1] ?? 'Unknown'

    const confidence =
      rawText.match(/\*\*Confidence:\s*(.*?)\*\*/)?.[1] ?? 'N/A'

    const reasoning = rawText.split('**Reasoning:**')[1] ?? rawText

    return { classification, confidence, reasoning }
  }

  const extractAnswerFromResponse = async (res) => {
    const json = await res.json()
    const answer =
      json?.data?.objects?.body?.answers?.[0]

    if (!answer) {
      throw new Error('Invalid response format')
    }

    return parseAnswer(answer)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const arrayBuffer = await file.arrayBuffer()

      const res = await fetch(
        'https://eaas-dev.aparavi.com/webhook?token=7f98cae24b4ee9395371abbb5514937c3fb4e34f0f2236faeba77d09092fd7fd&type=gpu',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/pdf',
            Authorization:
              'pk_3e09b10e575928090228a6d25039f4674d16606079963e62422d61125f6ab332',
          },
          body: arrayBuffer,
        }
      )

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const parsed = await extractAnswerFromResponse(res)
      setResult(parsed)
    } catch (err) {
      setError(err.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  const isHuman =
    result?.classification?.toLowerCase().includes('human')

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 ring-1 ring-orange-200">
        <h1 className="text-2xl font-semibold text-orange-600 mb-1">
          AI Content Detection
        </h1>
        <p className="text-sm text-orange-500 mb-6">
          Upload a document to check whether it is AI-generated or human-written.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-orange-600
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:bg-orange-500 file:text-white
                hover:file:bg-orange-600"
            />
            {file && (
              <p className="mt-2 text-xs text-gray-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-md
              hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing…' : 'Detect Content'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div
              className={`rounded-lg p-4 border ${
                isHuman
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {result.classification}
                </span>
                <span className="text-xs font-medium">
                  Confidence: {result.confidence}
                </span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none
              bg-orange-50 border border-orange-100
              rounded-lg p-5 max-h-[420px] overflow-y-auto">
              <h3>Reasoning</h3>
              <ReactMarkdown>{result.reasoning}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
