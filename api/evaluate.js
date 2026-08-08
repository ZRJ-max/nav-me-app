import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { answers } = req.body;
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = `أنت الخبير الاستشاري الذكي لمنصة NAV Me لتوجيه الشباب الذين لا يملكون أي فكرة عن شغفهم أو مسارهم المستقبلي من الصفر. 
قم بتحليل إجابات المستفيد الـ 15 (التي تجمع بين خيارات نعم/لا والإجابات النصية) استناداً إلى المنظومة العلمية الثلاثية:
1. البُعد الشرعي والفطري: التيسير والفطرة (Effort-to-Output)، ثغر الخدمة، والنفع المتعدي.
2. البُعد النفسي والذاتي: الدافعية الداخلية، حالة الانغماس (Flow)، وطبيعة التفكير.
3. البُعد الاجتماعي والواقعي: الملاءمة، واحتياجات سوق العمل الحديثة.

أصدر تقريراً تحليلياً باللغة العربية ومصمماً بهياكل HTML نظيفة (استخدم <h4>, <ul>, <li>, <strong>) يحتوي على:
- بصمة المسار الأساسية (Career DNA Profile) لمن كان ضائعاً وبدأ للتو.
- 3 مسارات وتخصصات مقترحة تناسب إجاباته تماماً مع نسبة تطابق وتعليل منطقي.
- تحليل مبسط لواقعه النفسي والفطري.
- خارطة طريق أولية للـ 90 يوماً القادمة لاكتشاف الذات والتجربة العملية.

إجابات المستفيد:
${answers}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ result: text });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
