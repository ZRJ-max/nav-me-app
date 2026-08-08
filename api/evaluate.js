export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { answers } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // التأكد من وجود المفتاح قبل الاتصال
    if (!apiKey) {
        return res.status(400).json({ error: 'مفتاح API غير موجود في إعدادات Vercel.' });
    }

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

    try {
        // الاتصال المباشر بخوادم جوجل بدون مكتبة
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();

        // إذا رفضت جوجل الاتصال، سنرسل رسالة الرفض مباشرة للشاشة
        if (!response.ok) {
            return res.status(400).json({ error: data.error?.message || 'مفتاح غير صالح أو خطأ في الاتصال' });
        }

        const textResult = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ result: textResult });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
