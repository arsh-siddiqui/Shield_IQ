import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { getVulnerabilityBySlug } from "../../services/vulnerabilityService";
import { submitAssessment } from "../../services/progressService";
import Button from "../../components/ui/Button";

export default function Assessment() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [vuln, setVuln] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getVulnerabilityBySlug(slug);
        setVuln(data);
      } catch (err) {
        navigate("/vulnerabilities");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, navigate]);

  const handleSelect = (questionId, optionId) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOptionId: answers[qId]
    }));
    
    setSubmitting(true);
    try {
      const res = await submitAssessment(vuln._id, formattedAnswers);
      setResult(res);
    } catch (err) {
      alert("Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!vuln || !vuln.content?.assessment) return null;

  const assessment = vuln.content.assessment;
  const isComplete = Object.keys(answers).length === assessment.length;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink mb-2">Assessment: {vuln.title}</h1>
        <p className="text-ink-light">Validate your understanding to complete this module.</p>
      </header>

      {result ? (
        <div className={`p-8 rounded-2xl border flex flex-col items-center text-center shadow-sm ${result.passed ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'}`}>
          {result.passed ? (
            <CheckCircle2 className="w-16 h-16 text-success mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-danger mb-4" />
          )}
          <h2 className={`text-2xl font-bold mb-2 ${result.passed ? 'text-success-800' : 'text-danger-800'}`}>
            {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h2>
          <div className="text-4xl font-extrabold text-ink my-4">{result.score}%</div>
          <p className="text-sm text-ink-light mb-6">
            {result.passed ? `Great job! You have demonstrated a solid understanding of ${vuln.title}.` : 'Review the theory and try again when you are ready.'}
          </p>
          <div className="flex gap-4">
            {!result.passed && (
              <Button variant="outline" onClick={() => { setResult(null); setAnswers({}); }}>Retry Assessment</Button>
            )}
            <Button variant="primary" onClick={() => navigate("/learning/progress")}>View Progress <ArrowRight className="w-4 h-4 ml-1"/></Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {assessment.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-4">
                <span className="text-primary mr-2">{idx + 1}.</span>{q.questionText}
              </h3>
              <div className="space-y-3">
                {q.options.map(opt => (
                  <label key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    answers[q.id] === opt.id ? 'border-primary bg-primary-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name={q.id} 
                      className="mt-1 flex-shrink-0" 
                      checked={answers[q.id] === opt.id}
                      onChange={() => handleSelect(q.id, opt.id)}
                    />
                    <span className="text-sm font-medium text-ink">{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleSubmit} disabled={!isComplete || submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null} Submit Assessment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
