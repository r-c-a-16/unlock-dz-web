(function () {
'use strict';
const $ = id => document.getElementById(id);
const K = { FAV: 'unlock_dz_favs', LAST: 'unlock_dz_last', RATING: 'unlock_dz_rating', LOG: 'unlock_dz_log_v1', THEME: 'unlock_dz_theme', LANG: 'unlock_dz_lang', IPB: 'unlock_dz_ipb' };
const LIM = { recs: 100, text: 4000, notes: 1000, imp: 512000 };
function load(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { toast('تعذر الحفظ على الجهاز (التخزين ممتلئ أو معطّل)'); return false; } }
function h(tag, a, ...kids) {
  const e = document.createElement(tag);
  for (const k in (a || {})) {
    if (k === 'text') e.textContent = a[k];
    else if (k === 'cls') e.className = a[k];
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), a[k]);
    else e.setAttribute(k, a[k]);
  }
  kids.forEach(c => c && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}
let tT;
function toast(m) { $('toastTxt').textContent = tx(m); $('toast').classList.add('show'); clearTimeout(tT); tT = setTimeout(() => $('toast').classList.remove('show'), 2400); }


/* ---------- i18n (ar / en / fr) ---------- */
const LANGS = { ar: { dir: 'rtl', code: 'AR' }, en: { dir: 'ltr', code: 'EN' }, fr: { dir: 'ltr', code: 'FR' } };
const LOCALE = { ar: 'ar-EG', en: 'en-GB', fr: 'fr-FR' };
let uiLang = (() => { try { const v = localStorage.getItem(K.LANG); return v === 'en' || v === 'fr' ? v : 'ar'; } catch (e) { return 'ar'; } })();
const TR_DATA = [["UNLOCK DZ — مساعد رسائل الاستئناف", "UNLOCK DZ — Appeal Message Assistant", "UNLOCK DZ — Assistant de messages d’appel"], ["UNLOCK DZ: تجهيز رسائل الاستئناف وتنظيم حالات الحسابات والألعاب.", "UNLOCK DZ: prepare appeal messages and organize account and game cases.", "UNLOCK DZ : préparez des messages d’appel et organisez vos cas de comptes et de jeux."], ["تغيير اللغة", "Change language", "Changer de langue"], ["العربية", "العربية", "العربية"], ["تبديل الوضع الفاتح والداكن", "Switch between light and dark mode", "Basculer entre le mode clair et le mode sombre"], ["الوضع الفاتح / الداكن", "Light / dark mode", "Mode clair / sombre"], ["أحدث تنبيهات الحظر", "Latest ban alerts", "Dernières alertes de bannissement"], ["مساعد لتجهيز رسائل الاستئناف وتنظيم حالاتك. يجهّز لك الرسالة ويوجّهك إلى القناة الرسمية.", "An assistant that prepares appeal messages and organizes your cases. It prepares the message and points you to the official channel.", "Un assistant qui prépare vos messages d’appel et organise vos dossiers. Il prépare le message et vous oriente vers le canal officiel."], ["ابدأ الآن", "Get started", "Commencer"], ["→ رجوع", "← Back", "← Retour"], ["اختر المنصة", "Choose the platform", "Choisissez la plateforme"], ["شبكة اجتماعية أو لعبة", "Social network or game", "Réseau social ou jeu"], ["ابحث عن منصة أو لعبة...", "Search for a platform or game...", "Rechercher une plateforme ou un jeu..."], ["المفضلة", "Favorites", "Favoris"], ["الشبكات الاجتماعية", "Social networks", "Réseaux sociaux"], ["الألعاب", "Games", "Jeux"], ["لا توجد منصة مطابقة للبحث.", "No platform matches your search.", "Aucune plateforme ne correspond à la recherche."], ["اختر نوع المشكلة ثم أكمل البيانات", "Choose the issue type, then fill in the details", "Choisissez le type de problème, puis complétez les informations"], ["ميزة تجريبية", "Beta feature", "Fonctionnalité expérimentale"], ["تجريبية | beta", "Experimental | beta", "Expérimental | bêta"], ["لقطة شاشة لرسالة الحظر (اختياري)", "Screenshot of the ban message (optional)", "Capture d’écran du message de bannissement (facultatif)"], ["تُستخدم الصورة لاقتراح نوع المشكلة. لا ترفع صورة تظهر فيها كلمة مرور أو رمز.", "The image is used to suggest the issue type. Do not upload an image showing a password or code.", "L’image sert à suggérer le type de problème. Ne téléversez pas d’image montrant un mot de passe ou un code."], ["تحليل لقطة الشاشة", "Analyze the screenshot", "Analyser la capture d’écran"], ["نوع المشكلة", "Issue type", "Type de problème"], ["ما الذي يحدث لك؟", "What is happening to you?", "Que vous arrive-t-il ?"], ["ما الذي ينطبق على حالتك؟ (اختياري)", "What applies to your case? (optional)", "Qu’est-ce qui correspond à votre cas ? (facultatif)"], ["اختر فقط ما تعرفه فعلًا. تُضاف العبارات التي تحددها إلى الرسالة بصياغة محايدة؛ أي ادعاء غير صحيح قد يضر بطلبك لدى المنصة.", "Choose only what you actually know. The statements you select are added to the message in neutral wording; any false claim may harm your request with the platform.", "Ne choisissez que ce que vous savez réellement. Les phrases sélectionnées sont ajoutées au message avec une formulation neutre ; toute affirmation inexacte peut nuire à votre demande auprès de la plateforme."], ["المعرّف", "Identifier", "Identifiant"], ["أدخل المعرّف العام فقط. لا تُدخل كلمة مرور أو رمز تحقق في أي حقل.", "Enter only the public identifier. Never enter a password or verification code in any field.", "Saisissez uniquement l’identifiant public. N’entrez jamais de mot de passe ou de code de vérification dans aucun champ."], ["تاريخ ظهور المشكلة (اختياري)", "Date the problem appeared (optional)", "Date d’apparition du problème (facultatif)"], ["تفاصيل الواقعة (اختياري)", "Details of the incident (optional)", "Détails de l’incident (facultatif)"], ["اكتب فقط ما تعرفه فعلًا، مثل نص الإشعار الذي وصلك.", "Write only what you actually know, such as the text of the notice you received.", "N’écrivez que ce que vous savez réellement, par exemple le texte de la notification reçue."], ["يبدو أن هذا الحقل يتضمن معلومة حساسة (كلمة مرور أو رمز أو رقم بطاقة). احذفها قبل المتابعة.", "This field seems to contain sensitive information (a password, code or card number). Remove it before continuing.", "Ce champ semble contenir une information sensible (mot de passe, code ou numéro de carte). Supprimez-la avant de continuer."], ["أؤكد بحسب علمي أنني لم أخالف شروط الخدمة (حدده فقط إن كان صحيحًا؛ تُضاف الجملة إلى الرسالة عند تحديده)", "To the best of my knowledge, I confirm that I did not violate the terms of service (tick only if true; the sentence is added to the message when ticked)", "Je confirme, à ma connaissance, ne pas avoir enfreint les conditions d’utilisation (à cocher uniquement si c’est vrai ; la phrase est ajoutée au message lorsqu’elle est cochée)"], ["لغة الرسالة", "Message language", "Langue du message"], ["الأسلوب", "Style", "Style"], ["رسمي مختصر", "Formal, short", "Formel, court"], ["رسمي مفصّل", "Formal, detailed", "Formel, détaillé"], ["تجهيز مسودة الرسالة", "Prepare the message draft", "Préparer le brouillon du message"], ["تم تجهيز مسودة الرسالة", "Your message draft is ready", "Le brouillon du message est prêt"], ["الرسالة لم تُرسل تلقائيًا. راجعها وعدّلها، ثم قدّمها بنفسك عبر القناة الرسمية للمنصة.", "The message was not sent automatically. Review and edit it, then submit it yourself through the platform’s official channel.", "Le message n’a pas été envoyé automatiquement. Relisez-le et modifiez-le, puis envoyez-le vous-même via le canal officiel de la plateforme."], ["فرصة القبول التقريبية", "Estimated chance of acceptance", "Chance d’acceptation estimée"], ["كيف حُسبت؟", "How was it calculated?", "Comment est-elle calculée ?"], ["تقدير إرشادي محلي يعتمد على نوع المشكلة واكتمال بياناتك فقط. ليس احتمالًا إحصائيًا ولا وعدًا؛ القرار النهائي بيد المنصة وحدها.", "A local, indicative estimate based only on the issue type and how complete your details are. It is not a statistical probability or a promise; the final decision rests with the platform alone.", "Une estimation indicative locale, fondée uniquement sur le type de problème et l’exhaustivité de vos informations. Ce n’est ni une probabilité statistique ni une promesse ; la décision finale appartient à la plateforme seule."], ["نص الرسالة", "Message text", "Texte du message"], ["يبدو أن النص يتضمن معلومة حساسة (كلمة مرور أو رمز). احذفها قبل النسخ أو الحفظ.", "The text seems to contain sensitive information (a password or code). Remove it before copying or saving.", "Le texte semble contenir une information sensible (mot de passe ou code). Supprimez-la avant de copier ou d’enregistrer."], ["نسخ الرسالة", "Copy message", "Copier le message"], ["حفظ في السجل", "Save to log", "Enregistrer dans l’historique"], ["تصدير كنص (.txt)", "Export as text (.txt)", "Exporter en texte (.txt)"], ["إرسال عبر الإيميل الفوري", "Send by email now", "Envoyer par e-mail maintenant"], ["إعادة إنشاء المسودة", "Regenerate the draft", "Régénérer le brouillon"], ["خطوات عامة مقترحة", "Suggested general steps", "Étapes générales suggérées"], ["إرشادات عامة غير مرتبطة بقرار محدد", "General guidance not tied to a specific decision", "Conseils généraux non liés à une décision précise"], ["هل أفادتك الأداة؟", "Did the tool help you?", "L’outil vous a-t-il aidé ?"], ["حالة جديدة", "New case", "Nouveau cas"], ["سجل الحالات والمسودات", "Cases and drafts log", "Historique des cas et brouillons"], ["محفوظ محليًا على هذا الجهاز فقط", "Stored locally on this device only", "Enregistré localement sur cet appareil uniquement"], ["السجل ليس في حساب سحابي؛ مسح بيانات المتصفح أو التطبيق قد يحذفه. صدّر نسخة احتياطية دوريًا. الحالات يحددها المستخدم يدويًا ولا يمكن للتطبيق معرفة رد المنصة.", "The log is not in a cloud account; clearing browser or app data may delete it. Export a backup regularly. Statuses are set manually by you, and the app cannot know the platform’s reply.", "L’historique n’est pas stocké dans un compte cloud ; effacer les données du navigateur ou de l’application peut le supprimer. Exportez régulièrement une sauvegarde. Les statuts sont définis manuellement par vous, et l’application ne peut pas connaître la réponse de la plateforme."], ["بحث", "Search", "Rechercher"], ["منصة أو نص...", "Platform or text...", "Plateforme ou texte..."], ["الحالة", "Status", "Statut"], ["تصدير السجل (JSON)", "Export log (JSON)", "Exporter l’historique (JSON)"], ["استيراد سجل", "Import log", "Importer un historique"], ["مسح السجل", "Clear log", "Effacer l’historique"], ["مركز المساعدة", "Help center", "Centre d’aide"], ["اختر منصة لعرض القنوات المتاحة", "Choose a platform to see the available channels", "Choisissez une plateforme pour voir les canaux disponibles"], ["المنصة", "Platform", "Plateforme"], ["حماية المستخدم", "User protection", "Protection de l’utilisateur"], ["ممارسات آمنة أثناء استرداد الحساب", "Safe practices while recovering an account", "Bonnes pratiques de sécurité lors de la récupération d’un compte"], ["لا تشارك كلمة المرور أو الرموز", "Never share your password or codes", "Ne partagez jamais votre mot de passe ni vos codes"], ["لا تعطِ كلمة المرور أو رموز التحقق أو رموز الاسترداد لأي شخص أو موقع، ولا يطلبها هذا التطبيق.", "Never give your password, verification codes or recovery codes to anyone or any website. This app never asks for them.", "Ne donnez votre mot de passe, vos codes de vérification ou de récupération à personne ni à aucun site. Cette application ne les demande jamais."], ["لا تدفع مقابل «ضمان» فك الحظر", "Never pay for a “guaranteed” unban", "Ne payez jamais pour une levée de bannissement « garantie »"], ["لا أحد خارج المنصة يستطيع ضمان رفع الحظر. كل من يعد بذلك مشتبه به.", "No one outside the platform can guarantee lifting a ban. Anyone who promises it is suspect.", "Personne en dehors de la plateforme ne peut garantir la levée d’un bannissement. Quiconque le promet est suspect."], ["لا تمنح غيرك وصولًا إلى حسابك", "Never give others access to your account", "Ne donnez à personne l’accès à votre compte"], ["لا تسلّم الحساب لوسيط ولا تثبّت تطبيقات تعد بالاسترداد.", "Do not hand your account to an intermediary and do not install apps that promise recovery.", "Ne confiez pas votre compte à un intermédiaire et n’installez pas d’applications promettant une récupération."], ["استخدم القنوات الرسمية وتحقق من العنوان", "Use official channels and check the address", "Utilisez les canaux officiels et vérifiez l’adresse"], ["تأكد من نطاق الموقع قبل تسجيل الدخول، وافتح الأدوات من التطبيق الرسمي أو من مركز المساعدة نفسه.", "Check the website’s domain before logging in, and open tools from the official app or the help center itself.", "Vérifiez le nom de domaine du site avant de vous connecter, et ouvrez les outils depuis l’application officielle ou le centre d’aide lui-même."], ["احذر رفع وثائقك الشخصية", "Be careful uploading your personal documents", "Soyez prudent avant de téléverser vos documents personnels"], ["لا ترفع صور الهوية إلا داخل القناة الرسمية للمنصة وعند طلبها منك فقط.", "Upload ID photos only inside the platform’s official channel and only when asked.", "Ne téléversez des photos de pièce d’identité que dans le canal officiel de la plateforme et uniquement si on vous le demande."], ["تجنب التطبيقات غير الرسمية", "Avoid unofficial apps", "Évitez les applications non officielles"], ["استخدام برامج الطرف الثالث من أسباب تقييد الحسابات الشائعة؛ استخدم التطبيق الرسمي فقط.", "Using third-party software is a common cause of account restrictions; use the official app only.", "L’utilisation de logiciels tiers est une cause fréquente de restriction de compte ; utilisez uniquement l’application officielle."], ["عن الأداة", "About the tool", "À propos de l’outil"], ["رسائل قابلة للتعديل", "Editable messages", "Messages modifiables"], ["بالعربية والإنجليزية والفرنسية", "In Arabic, English and French", "En arabe, en anglais et en français"], ["قناتنا على تلجرام", "Our Telegram channel", "Notre chaîne Telegram"], ["الإعدادات والبيانات", "Settings and data", "Paramètres et données"], ["إدارة تفضيلاتك وبياناتك", "Manage your preferences and data", "Gérez vos préférences et vos données"], ["ما الذي يُخزَّن؟", "What is stored?", "Que stocke-t-on ?"], ["المفضلة، آخر منصة، التقييم، والسجل (حتى 100 سجل، كل رسالة حتى 4000 حرف).", "Favorites, last platform, rating and the log (up to 100 records, each message up to 4000 characters).", "Favoris, dernière plateforme, évaluation et historique (jusqu’à 100 enregistrements, chaque message jusqu’à 4000 caractères)."], ["دون اتصال", "Offline", "Hors ligne"], ["إنشاء الرسائل والسجل والتصدير تعمل دون اتصال. الخطوط والأيقونات وفتح روابط المساعدة تحتاج إنترنت. قراءة لقطات الشاشة تحتاج إنترنت أول مرة لتحميل الأداة وبيانات اللغة.", "Message creation, the log and export work offline. Fonts, icons and opening help links need internet. Reading screenshots needs internet the first time to load the tool and language data.", "La création de messages, l’historique et l’exportation fonctionnent hors ligne. Les polices, les icônes et l’ouverture des liens d’aide nécessitent Internet. La lecture des captures d’écran nécessite Internet la première fois pour charger l’outil et les données de langue."], ["التكاملات", "Integrations", "Intégrations"], ["لا يوجد حاليًا أي تكامل رسمي: لا فحص لحالة الحظر ولا إرسال استئناف ولا تتبع للردود.", "There is currently no official integration: no ban status check, no appeal submission and no tracking of replies.", "Il n’existe actuellement aucune intégration officielle : ni vérification du statut de bannissement, ni envoi d’appel, ni suivi des réponses."], ["ما الجديد", "What’s new", "Nouveautés"], ["استعرض ميزات آخر تحديث.", "Browse the features of the latest update.", "Découvrez les fonctionnalités de la dernière mise à jour."], ["عرض الميزات الجديدة", "View new features", "Voir les nouvelles fonctionnalités"], ["مسح كل البيانات المحلية", "Clear all local data", "Effacer toutes les données locales"], ["شعار UNLOCK DZ الذهبي", "UNLOCK DZ golden logo", "Logo doré UNLOCK DZ"], ["الرئيسية", "Home", "Accueil"], ["المنصات", "Platforms", "Plateformes"], ["السجل", "Log", "Historique"], ["المساعدة", "Help", "Aide"], ["الإعدادات", "Settings", "Paramètres"], ["تحديث جديد", "New update", "Nouvelle mise à jour"], ["تمت إضافة ميزات جديدة", "New features have been added", "De nouvelles fonctionnalités ont été ajoutées"], ["تحسينات تجعل رسائلك أدق وبياناتك أكثر أمانًا.", "Improvements that make your messages more accurate and your data safer.", "Des améliorations qui rendent vos messages plus précis et vos données plus sûres."], ["قراءة لقطة شاشة الحظر (تجريبية | beta)", "Read the ban screenshot (experimental | beta)", "Lecture de la capture d’écran du bannissement (expérimental | bêta)"], ["ارفع لقطة شاشة لرسالة الحظر، ثم يُقترح عليك نوع المشكلة المناسب. الميزة تجريبية وقد لا تقرأ الصور غير الواضحة.", "Upload a screenshot of the ban message, and the suitable issue type is then suggested. The feature is experimental and may not read unclear images.", "Importez une capture d’écran du message de bannissement, puis le type de problème adapté vous est suggéré. La fonctionnalité est expérimentale et peut ne pas lire les images floues."], ["قوالب محايدة وصادقة", "Neutral and honest templates", "Des modèles neutres et honnêtes"], ["اختر العبارات التي تنطبق على حالتك فقط، مثل «لم يصلني إشعار واضح»، بدل ادعاءات جاهزة قد لا تكون صحيحة.", "Pick only the statements that apply to your case, such as “I did not receive a clear notice”, instead of ready-made claims that may not be true.", "Choisissez uniquement les phrases qui correspondent à votre cas, comme « Je n’ai pas reçu de notification claire », plutôt que des affirmations toutes faites qui peuvent être inexactes."], ["فحص أمان قبل الإنشاء", "Safety check before generating", "Contrôle de sécurité avant la création"], ["تُفحص جميع الحقول (المعرّف والتفاصيل والملاحظات) لمنع إدخال كلمات المرور أو الرموز أو أرقام البطاقات.", "All fields (identifier, details and notes) are checked to prevent entering passwords, codes or card numbers.", "Tous les champs (identifiant, détails et notes) sont vérifiés pour empêcher la saisie de mots de passe, de codes ou de numéros de carte."], ["تحقق أدق من المعرّف", "More precise identifier validation", "Validation plus précise de l’identifiant"], ["يقبل الحقل المعرّف العام فقط، ويرفض المسافات والنصوص الإضافية.", "The field accepts only the public identifier and rejects spaces and extra text.", "Le champ n’accepte que l’identifiant public et refuse les espaces et le texte supplémentaire."], ["إرشادات استئناف مؤرخة", "Dated appeal guidance", "Conseils d’appel datés"], ["خطوات الاستئناف لعدة منصات مع تاريخ آخر مراجعة وتنبيه عندما تقدُم المعلومة.", "Appeal steps for several platforms with a last-reviewed date and a warning when the information gets old.", "Étapes d’appel pour plusieurs plateformes, avec la date de dernière vérification et un avertissement lorsque l’information devient ancienne."], ["يمكنك التخطي بعد 3 ثوانٍ", "You can skip after 3 seconds", "Vous pouvez passer après 3 secondes"], ["تخطي بعد 3", "Skip in 3", "Passer dans 3"], ["تعذر الحفظ على الجهاز (التخزين ممتلئ أو معطّل)", "Could not save on the device (storage is full or disabled)", "Impossible d’enregistrer sur l’appareil (stockage plein ou désactivé)"], ["→ تغيير المنصة", "← Change platform", "← Changer de plateforme"], ["→ تعديل البيانات", "← Edit details", "← Modifier les informations"], ["{type} (المعرّف العام)", "{type} (public identifier)", "{type} (identifiant public)"], ["اسم المستخدم", "Username", "Nom d’utilisateur"], ["رقم الهاتف", "Phone number", "Numéro de téléphone"], ["البريد الإلكتروني", "Email address", "Adresse e-mail"], ["البريد أو اسم المستخدم", "Email or username", "E-mail ou nom d’utilisateur"], ["معرّف اللاعب", "Player ID", "Identifiant du joueur"], ["وصلني إشعار رسمي", "I received an official notice", "J’ai reçu une notification officielle"], ["لم يصلني أي إشعار", "I received no notice", "Je n’ai reçu aucune notification"], ["تعذر تسجيل الدخول", "Unable to log in", "Connexion impossible"], ["تظهر رسالة تعطيل أو حظر", "A disabled or banned message appears", "Un message de désactivation ou de bannissement s’affiche"], ["اختر نوع المشكلة {ban} بدل هذا الخيار.", "Choose the issue type {ban} instead of this option.", "Choisissez le type de problème {ban} à la place de cette option."], ["كلمة المرور لا تعمل", "The password does not work", "Le mot de passe ne fonctionne pas"], ["استخدم خيار «نسيت كلمة المرور» من التطبيق أو الموقع الرسمي فقط.", "Use the “Forgot password” option from the official app or website only.", "Utilisez uniquement l’option « Mot de passe oublié » de l’application ou du site officiel."], ["لا يصلني رمز التحقق", "I don’t receive the verification code", "Je ne reçois pas le code de vérification"], ["تأكد من الرقم أو البريد، وتحقق من الرسائل غير المرغوبة، ثم استخدم خيار إعادة الإرسال الرسمي.", "Check the number or email, look in your spam folder, then use the official resend option.", "Vérifiez le numéro ou l’e-mail, consultez vos courriers indésirables, puis utilisez l’option officielle de renvoi."], ["لا أعرف السبب", "I don’t know the reason", "Je ne connais pas la cause"], ["حدّث التطبيق، أعد تشغيل الجهاز، وجرّب شبكة مختلفة قبل مراسلة الدعم.", "Update the app, restart the device and try a different network before contacting support.", "Mettez l’application à jour, redémarrez l’appareil et essayez un autre réseau avant de contacter l’assistance."], ["تعطيل الحساب", "Account disabled", "Compte désactivé"], ["راجع نص الإشعار واحتفظ بلقطة شاشة؛ فهو المصدر الوحيد لسبب القرار.", "Review the text of the notice and keep a screenshot; it is the only source of the reason for the decision.", "Relisez le texte de la notification et conservez une capture d’écran ; c’est la seule source du motif de la décision."], ["لا يستطيع هذا التطبيق معرفة السبب. افحص بريدك (والرسائل غير المرغوبة) وخيارات المساعدة داخل المنصة.", "This app cannot know the reason. Check your email (and spam) and the help options inside the platform.", "Cette application ne peut pas connaître le motif. Vérifiez votre e-mail (et les courriers indésirables) ainsi que les options d’aide dans la plateforme."], ["حظر الحساب أو تقييده", "Account banned or restricted", "Compte banni ou restreint"], ["لا يمكن تحديد سبب الحظر من المعرّف وحده. ارجع إلى إشعارات المنصة الرسمية.", "The reason for a ban cannot be determined from the identifier alone. Refer to the platform’s official notices.", "Le motif d’un bannissement ne peut pas être déterminé à partir de l’identifiant seul. Consultez les notifications officielles de la plateforme."], ["مشكلة تحقق أو استرداد الحساب", "Verification or account recovery issue", "Problème de vérification ou de récupération du compte"], ["فقدت الوصول إلى البريد أو الرقم", "I lost access to the email or number", "J’ai perdu l’accès à l’e-mail ou au numéro"], ["ابدأ من صفحة الاسترداد الرسمية ولا تُعطِ بياناتك لأي وسيط.", "Start from the official recovery page and never give your details to an intermediary.", "Commencez depuis la page officielle de récupération et ne donnez vos informations à aucun intermédiaire."], ["طُلبت مني وثيقة هوية", "I was asked for an ID document", "On m’a demandé une pièce d’identité"], ["قدّمها داخل القناة الرسمية فقط وعند طلبها، ولا ترسلها لموقع آخر.", "Provide it only inside the official channel and only when requested; never send it to another site.", "Fournissez-la uniquement dans le canal officiel et seulement si on vous la demande ; ne l’envoyez jamais à un autre site."], ["حظر أو عقوبة داخل اللعبة", "In-game ban or penalty", "Bannissement ou sanction dans le jeu"], ["ظهر لي إشعار داخل اللعبة", "An in-game notice appeared", "Une notification est apparue dans le jeu"], ["دوّن نص الإشعار ومدته؛ الناشر وحده يحدد السبب.", "Write down the notice text and its duration; only the publisher determines the reason.", "Notez le texte de la notification et sa durée ; seul l’éditeur détermine le motif."], ["لا أعرف سبب العقوبة", "I don’t know the reason for the penalty", "Je ne connais pas le motif de la sanction"], ["لا يمكن تحديد السبب من المعرّف وحده. اطلب التوضيح من دعم الناشر الرسمي.", "The reason cannot be determined from the identifier alone. Ask the official publisher’s support for clarification.", "Le motif ne peut pas être déterminé à partir de l’identifiant seul. Demandez des précisions à l’assistance officielle de l’éditeur."], ["مشكلة أخرى", "Other issue", "Autre problème"], ["يرجى إدخال رقم هاتف صحيح (أرقام فقط، من 9 إلى 15 رقمًا).", "Please enter a valid phone number (digits only, 9 to 15 digits).", "Veuillez saisir un numéro de téléphone valide (chiffres uniquement, de 9 à 15 chiffres)."], ["يرجى إدخال بريد إلكتروني صحيح.", "Please enter a valid email address.", "Veuillez saisir une adresse e-mail valide."], ["يرجى إدخال معرّف اللاعب (3-60 حرفًا).", "Please enter the player ID (3–60 characters).", "Veuillez saisir l’identifiant du joueur (3 à 60 caractères)."], ["يرجى إدخال اسم مستخدم صحيح (2-60 حرفًا).", "Please enter a valid username (2–60 characters).", "Veuillez saisir un nom d’utilisateur valide (2 à 60 caractères)."], ["يرجى إدخال بريد أو اسم مستخدم صحيح.", "Please enter a valid email or username.", "Veuillez saisir un e-mail ou un nom d’utilisateur valide."], ["يبدو أن الحقل يحتوي كلمة مرور أو رمزًا. احذفه وأدخل المعرّف العام فقط.", "The field seems to contain a password or code. Remove it and enter only the public identifier.", "Le champ semble contenir un mot de passe ou un code. Supprimez-le et saisissez uniquement l’identifiant public."], ["المعرّف لا يجب أن يحتوي مسافات أو نصًا إضافيًا. أدخل المعرّف العام فقط.", "The identifier must not contain spaces or extra text. Enter only the public identifier.", "L’identifiant ne doit contenir ni espaces ni texte supplémentaire. Saisissez uniquement l’identifiant public."], ["مسودة", "Draft", "Brouillon"], ["جاهز للإرسال", "Ready to send", "Prêt à envoyer"], ["أرسلته بنفسي", "Sent by me", "Envoyé par moi"], ["بانتظار الرد", "Awaiting reply", "En attente de réponse"], ["انتهت المتابعة", "Follow-up ended", "Suivi terminé"], ["إضافة {p} إلى المفضلة", "Add {p} to favorites", "Ajouter {p} aux favoris"], ["الأخير", "Last", "Dernier"], ["لعبة", "Game", "Jeu"], ["شبكة اجتماعية", "Social network", "Réseau social"], ["لديك مسودة غير محفوظة ستُستبدل. المتابعة؟", "You have an unsaved draft that will be replaced. Continue?", "Vous avez un brouillon non enregistré qui sera remplacé. Continuer ?"], ["أو", "or", "ou"], ["اختر نوع المشكلة أولًا.", "Choose the issue type first.", "Choisissez d’abord le type de problème."], ["حقل التفاصيل يبدو أنه يتضمن معلومة حساسة (كلمة مرور أو رمز أو رقم بطاقة). احذفها ثم أعد المحاولة.", "The details field seems to contain sensitive information (a password, code or card number). Remove it and try again.", "Le champ des détails semble contenir une information sensible (mot de passe, code ou numéro de carte). Supprimez-la puis réessayez."], ["لا يوجد قالب مناسب لهذه الحالة. صف مشكلتك في «تفاصيل الواقعة» لتجهيز رسالة، أو راجع مركز المساعدة الرسمي.", "There is no suitable template for this case. Describe your problem in “Details of the incident” to prepare a message, or check the official help center.", "Il n’existe pas de modèle adapté à ce cas. Décrivez votre problème dans « Détails de l’incident » pour préparer un message, ou consultez le centre d’aide officiel."], ["تاريخ ظهور المشكلة لا يمكن أن يكون في المستقبل.", "The date the problem appeared cannot be in the future.", "La date d’apparition du problème ne peut pas être dans le futur."], ["عدّلت الرسالة يدويًا. إعادة الإنشاء ستستبدل تعديلاتك. المتابعة؟", "You edited the message manually. Regenerating will replace your changes. Continue?", "Vous avez modifié le message manuellement. La régénération remplacera vos modifications. Continuer ?"], ["تعطيل بدون سبب واضح", "Disabled without a clear reason", "Désactivation sans motif clair"], ["حظر أو تقييد بدون سبب واضح", "Ban or restriction without a clear reason", "Bannissement ou restriction sans motif clair"], ["عقوبة داخل اللعبة", "In-game penalty", "Sanction dans le jeu"], ["مشكلة دخول", "Login issue", "Problème de connexion"], ["استرداد أو تحقق", "Recovery or verification", "Récupération ou vérification"], ["مشكلة عامة", "General issue", "Problème général"], ["أساس نوع المشكلة ({n})", "Issue type baseline ({n})", "Base selon le type de problème ({n})"], ["تأكيدك أنك لم تخالف الشروط", "Your confirmation that you did not violate the terms", "Votre confirmation de ne pas avoir enfreint les conditions"], ["تفاصيل الواقعة وتاريخ ظهور المشكلة", "Incident details and the date the problem appeared", "Détails de l’incident et date d’apparition du problème"], ["فرصة القبول: {p}% — طلبك مكتمل. جهّز إثبات الهوية إن طُلب منك، وقدّم الطلب مرة واحدة فقط عبر القناة الرسمية.", "Chance of acceptance: {p}% — your request is complete. Prepare proof of identity if asked, and submit the request only once through the official channel.", "Chance d’acceptation : {p}% — votre demande est complète. Préparez une preuve d’identité si on vous la demande, et n’envoyez la demande qu’une seule fois via le canal officiel."], ["فرصة القبول: {p}% — أضف تفاصيل الواقعة وتاريخها، وأكّد عدم المخالفة إن كان ذلك صحيحًا فعلًا لتقوية الطلب.", "Chance of acceptance: {p}% — add the incident details and date, and confirm no violation if that is truly the case, to strengthen the request.", "Chance d’acceptation : {p}% — ajoutez les détails et la date de l’incident, et confirmez l’absence d’infraction si c’est réellement le cas, afin de renforcer la demande."], ["فرصة القبول: {p}% — الحالات الصارمة صعبة. كن دقيقًا وصادقًا، وراجع شروط المنصة قبل التقديم.", "Chance of acceptance: {p}% — strict cases are difficult. Be precise and honest, and review the platform’s terms before submitting.", "Chance d’acceptation : {p}% — les cas stricts sont difficiles. Soyez précis et honnête, et relisez les conditions de la plateforme avant d’envoyer."], ["إغلاق التنبيهات", "Close alerts", "Fermer les alertes"], ["إغلاق", "Close", "Fermer"], ["أحدث تنبيهات الحظر (إرشادية)", "Latest ban alerts (indicative)", "Dernières alertes de bannissement (indicatives)"], ["تنبيه قديم، قد لا يكون ساريًا الآن.", "Old alert; it may no longer apply.", "Alerte ancienne ; elle n’est peut-être plus valable."], ["افتح تطبيق {p} الرسمي أو موقعه الرسمي فقط.", "Open the official {p} app or its official website only.", "Ouvrez uniquement l’application officielle {p} ou son site officiel."], ["راجع أي إشعار أو بريد رسمي يذكر سبب القرار، واحتفظ بلقطة شاشة.", "Review any official notice or email stating the reason for the decision, and keep a screenshot.", "Consultez toute notification ou tout e-mail officiel indiquant le motif de la décision, et conservez une capture d’écran."], ["ابحث عن خيارات المساعدة أو الاستئناف داخل المنصة نفسها.", "Look for help or appeal options inside the platform itself.", "Cherchez les options d’aide ou d’appel dans la plateforme elle-même."], ["راجع المسودة وعدّل أو احذف أي جزء لا ينطبق على حالتك.", "Review the draft and edit or delete any part that does not apply to your case.", "Relisez le brouillon et modifiez ou supprimez toute partie qui ne correspond pas à votre cas."], ["قدّم الطلب بنفسك عبر القناة الرسمية. لا ترسل كلمات مرور أو رموز تحقق.", "Submit the request yourself through the official channel. Do not send passwords or verification codes.", "Envoyez la demande vous-même via le canal officiel. N’envoyez ni mots de passe ni codes de vérification."], ["احتفظ بنسخة من المراسلات؛ مدة الرد وقرار المنصة يحددهما الطرف الرسمي فقط.", "Keep a copy of the correspondence; the response time and the platform’s decision are determined by the official party only.", "Conservez une copie des échanges ; le délai de réponse et la décision de la plateforme sont déterminés uniquement par la partie officielle."], ["طريقة الاستئناف لدى المنصة", "The platform’s appeal method", "Procédure d’appel de la plateforme"], ["فتح الصفحة الرسمية", "Open the official page", "Ouvrir la page officielle"], ["آخر مراجعة لهذه المعلومة: {d}", "Last review of this information: {d}", "Dernière vérification de cette information : {d}"], ["مضى أكثر من {n} يومًا، وقد تكون الخطوات تغيّرت فتحقق من المنصة.", "More than {n} days have passed, and the steps may have changed; check with the platform.", "Plus de {n} jours se sont écoulés et les étapes ont peut-être changé ; vérifiez auprès de la plateforme."], ["قد تتطلب الخطوات تسجيل الدخول إلى حسابك، وقد تتغير الروابط دون إشعار.", "The steps may require logging in to your account, and links may change without notice.", "Les étapes peuvent nécessiter de vous connecter à votre compte, et les liens peuvent changer sans préavis."], ["مركز المساعدة الرسمي: {u}", "Official help center: {u}", "Centre d’aide officiel : {u}"], ["فتح مركز المساعدة", "Open the help center", "Ouvrir le centre d’aide"], ["قد يتغير هذا الرابط أو لا يفتح؛ إن لم يعمل فابحث عن «المساعدة» داخل التطبيق الرسمي، وتأكد أن النطاق يعود للجهة الرسمية قبل تسجيل الدخول.", "This link may change or fail to open; if it does not work, look for “Help” inside the official app, and make sure the domain belongs to the official party before logging in.", "Ce lien peut changer ou ne pas s’ouvrir ; s’il ne fonctionne pas, cherchez « Aide » dans l’application officielle, et vérifiez que le domaine appartient bien à l’entité officielle avant de vous connecter."], ["تأكد أن النطاق يعود للجهة الرسمية قبل تسجيل الدخول، وإن لم يفتح الرابط فابحث عن «المساعدة» داخل التطبيق الرسمي.", "Make sure the domain belongs to the official party before logging in, and if the link does not open, look for “Help” inside the official app.", "Vérifiez que le domaine appartient bien à l’entité officielle avant de vous connecter, et si le lien ne s’ouvre pas, cherchez « Aide » dans l’application officielle."], ["رابط مركز المساعدة الرسمي غير متوفر حاليًا في التطبيق. ابحث عن «المساعدة» أو «الدعم» داخل التطبيق الرسمي نفسه.", "The official help center link is not currently available in the app. Look for “Help” or “Support” inside the official app itself.", "Le lien du centre d’aide officiel n’est pas disponible actuellement dans l’application. Cherchez « Aide » ou « Assistance » dans l’application officielle elle-même."], ["لا يوفّر التطبيق رابط استئناف مباشر؛ ابحث عن خيار الاستئناف أو «تقديم طلب» داخل مركز المساعدة.", "The app does not provide a direct appeal link; look for the appeal option or “Submit a request” inside the help center.", "L’application ne fournit pas de lien d’appel direct ; cherchez l’option d’appel ou « Envoyer une demande » dans le centre d’aide."], ["لا توجد رسالة لنسخها", "There is no message to copy", "Aucun message à copier"], ["النص قد يحتوي معلومة حساسة. نسخه رغم ذلك؟", "The text may contain sensitive information. Copy it anyway?", "Le texte peut contenir une information sensible. Le copier malgré tout ?"], ["تم نسخ الرسالة", "Message copied", "Message copié"], ["تعذر النسخ، حدّد النص وانسخه يدويًا", "Could not copy; select the text and copy it manually", "Copie impossible ; sélectionnez le texte et copiez-le manuellement"], ["لا توجد رسالة", "There is no message", "Aucun message"], ["الرسالة فارغة", "The message is empty", "Le message est vide"], ["الرسالة أطول من {n} حرف", "The message is longer than {n} characters", "Le message dépasse {n} caractères"], ["النص قد يحتوي معلومة حساسة. حفظه رغم ذلك؟", "The text may contain sensitive information. Save it anyway?", "Le texte peut contenir une information sensible. L’enregistrer malgré tout ?"], ["بلغ السجل الحد الأقصى ({n}). احذف بعض السجلات.", "The log has reached its maximum ({n}). Delete some records.", "L’historique a atteint sa limite ({n}). Supprimez quelques enregistrements."], ["تم الحفظ في السجل", "Saved to the log", "Enregistré dans l’historique"], ["لديك مسودة غير محفوظة. بدء حالة جديدة؟", "You have an unsaved draft. Start a new case?", "Vous avez un brouillon non enregistré. Commencer un nouveau cas ?"], ["لا توجد نتائج مطابقة.", "No matching results.", "Aucun résultat correspondant."], ["لا توجد مسودات محفوظة بعد. جهّز رسالة ثم اضغط «حفظ في السجل».", "No saved drafts yet. Prepare a message, then tap “Save to log”.", "Aucun brouillon enregistré pour l’instant. Préparez un message, puis appuyez sur « Enregistrer dans l’historique »."], ["تم تحديث الحالة", "Status updated", "Statut mis à jour"], ["ملاحظاتك (اختياري)", "Your notes (optional)", "Vos notes (facultatif)"], ["الملاحظات قد تحتوي معلومة حساسة (كلمة مرور أو رمز)، لم تُحفظ.", "The notes may contain sensitive information (a password or code) and were not saved.", "Les notes peuvent contenir une information sensible (mot de passe ou code) et n’ont pas été enregistrées."], ["تم حفظ الملاحظات", "Notes saved", "Notes enregistrées"], ["أُنشئ: {c} • آخر تعديل: {u}", "Created: {c} • Last edited: {u}", "Créé : {c} • Dernière modification : {u}"], ["فتح وتعديل", "Open and edit", "Ouvrir et modifier"], ["حذف", "Delete", "Supprimer"], ["حذف هذا السجل نهائيًا؟", "Delete this record permanently?", "Supprimer définitivement cet enregistrement ?"], ["تم الحذف", "Deleted", "Supprimé"], ["كل الحالات", "All statuses", "Tous les statuts"], ["السجل فارغ", "The log is empty", "L’historique est vide"], ["مسح كل السجل نهائيًا؟ لا يمكن التراجع.", "Clear the entire log permanently? This cannot be undone.", "Effacer définitivement tout l’historique ? Cette action est irréversible."], ["تم مسح السجل", "Log cleared", "Historique effacé"], ["لا يوجد ما يُصدَّر", "Nothing to export", "Rien à exporter"], ["الملف كبير جدًا", "The file is too large", "Le fichier est trop volumineux"], ["تعذرت قراءة الملف", "Could not read the file", "Impossible de lire le fichier"], ["ملف غير صالح", "Invalid file", "Fichier non valide"], ["ملف غير صالح: البنية غير مطابقة", "Invalid file: the structure does not match", "Fichier non valide : la structure ne correspond pas"], ["لا توجد سجلات صالحة في الملف", "There are no valid records in the file", "Aucun enregistrement valide dans le fichier"], ["استيراد {n} سجل ودمجها مع الحالي؟", "Import {n} records and merge them with the current ones?", "Importer {n} enregistrements et les fusionner avec ceux existants ?"], ["تم استيراد {n} سجل", "{n} records imported", "{n} enregistrements importés"], ["تنبيه: الإرشادات هنا عامة وليست قرارًا من المنصة. ما يحدد حالتك هو إشعار المنصة الرسمي فقط.", "Note: the guidance here is general and is not a decision by the platform. Only the platform’s official notice determines your case.", "Remarque : les conseils ici sont généraux et ne constituent pas une décision de la plateforme. Seule la notification officielle de la plateforme détermine votre cas."], ["مسح كل البيانات المحلية (المفضلة، آخر منصة، التقييم، السجل)؟ لا يمكن التراجع.", "Clear all local data (favorites, last platform, rating, log)? This cannot be undone.", "Effacer toutes les données locales (favoris, dernière plateforme, évaluation, historique) ? Cette action est irréversible."], ["تعذر المسح", "Could not clear", "Effacement impossible"], ["تم مسح البيانات المحلية", "Local data cleared", "Données locales effacées"], ["متابعة مع {p}", "Continue with {p}", "Continuer avec {p}"], ["تعذر النسخ، انسخه يدويًا", "Could not copy; copy it manually", "Copie impossible ; copiez-le manuellement"], ["مساعد لتجهيز رسائل الاستئناف وتنظيم حالات الحسابات", "An assistant for preparing appeal messages and organizing account cases", "Un assistant pour préparer des messages d’appel et organiser les cas de comptes"], ["تم نسخ رابط الموقع", "Site link copied", "Lien du site copié"], ["تعذر النسخ", "Could not copy", "Copie impossible"], ["تخطي", "Skip", "Passer"], ["يمكنك المتابعة الآن", "You can continue now", "Vous pouvez continuer maintenant"], ["تخطي بعد {n}", "Skip in {n}", "Passer dans {n}"], ["لا يوجد بريد دعم موثّق لهذه المنصة", "No verified support email for this platform", "Aucune adresse e-mail d’assistance vérifiée pour cette plateforme"], ["النص قد يحتوي معلومة حساسة. فتح البريد رغم ذلك؟", "The text may contain sensitive information. Open the email anyway?", "Le texte peut contenir une information sensible. Ouvrir l’e-mail malgré tout ?"], ["الرسالة طويلة: نُسخت، الصقها داخل البريد", "The message is long: it was copied, paste it into the email", "Le message est long : il a été copié, collez-le dans l’e-mail"], ["الرسالة طويلة: انسخها يدويًا والصقها داخل البريد", "The message is long: copy it manually and paste it into the email", "Le message est long : copiez-le manuellement et collez-le dans l’e-mail"], ["اختر منصة أولًا", "Choose a platform first", "Choisissez d’abord une plateforme"], ["الصورة كبيرة جدًا (الحد 8 ميغابايت).", "The image is too large (limit 8 MB).", "L’image est trop volumineuse (limite de 8 Mo)."], ["جارٍ تحميل أداة القراءة (أول مرة فقط)...", "Loading the reading tool (first time only)...", "Chargement de l’outil de lecture (première fois uniquement)..."], ["جارٍ قراءة النص...", "Reading the text...", "Lecture du texte..."], ["جارٍ تحميل بيانات اللغة...", "Loading language data...", "Chargement des données de langue..."], ["الصورة غير واضحة. جرّب لقطة أوضح أو أكبر وبدون انعكاس، أو اختر نوع المشكلة يدويًا.", "The image is unclear. Try a clearer or larger screenshot without glare, or choose the issue type manually.", "L’image n’est pas nette. Essayez une capture plus nette ou plus grande, sans reflet, ou choisissez le type de problème manuellement."], ["قُرئ النص لكن لم أجد كلمات حظر معروفة. اختر نوع المشكلة يدويًا.", "The text was read but no known ban keywords were found. Choose the issue type manually.", "Le texte a été lu mais aucun mot-clé de bannissement connu n’a été trouvé. Choisissez le type de problème manuellement."], ["تنبيه: يبدو أن الصورة تتضمن معلومة حساسة، لا تشاركها مع أحد.", "Note: the image seems to contain sensitive information; do not share it with anyone.", "Remarque : l’image semble contenir une information sensible ; ne la partagez avec personne."], ["تمت القراءة.", "Done reading.", "Lecture terminée."], ["كلمات مكتشفة:", "Detected words:", "Mots détectés :"], ["تطبيق الاقتراح: {n}", "Apply suggestion: {n}", "Appliquer la suggestion : {n}"], ["تم اختيار نوع المشكلة", "Issue type selected", "Type de problème sélectionné"], ["نوع المشكلة المقترح: {n} (اقتراح تقريبي، راجعه قبل المتابعة)", "Suggested issue type: {n} (approximate suggestion, review it before continuing)", "Type de problème suggéré : {n} (suggestion approximative, vérifiez-la avant de continuer)"], ["تعذر تشغيل القراءة. تحقق من الاتصال بالإنترنت (لتحميل الأداة أول مرة) أو اختر النوع يدويًا.", "Could not run the reader. Check your internet connection (to load the tool the first time) or choose the type manually.", "Impossible de lancer la lecture. Vérifiez votre connexion Internet (pour charger l’outil la première fois) ou choisissez le type manuellement."], ["أبلغ عن معلومة أو رابط لم يعد يعمل", "Report information or a link that no longer works", "Signaler une information ou un lien qui ne fonctionne plus"], ["إصدار الموقع", "Site version", "Version du site"]];
const DICT = { en: Object.create(null), fr: Object.create(null) };
TR_DATA.forEach(r => { DICT.en[r[0]] = r[1]; DICT.fr[r[0]] = r[2]; });
[["اكتمال طلبك", "How complete your request is", "Complétude de votre demande"], ["ما الذي ينقص؟", "What is missing?", "Que manque-t-il ?"], ["مؤشر محلي يوضح ما أضفته إلى طلبك وما ينقصه. لا يتنبأ بقرار المنصة ولا يعدك بشيء؛ القرار النهائي بيد المنصة وحدها.", "A local indicator showing what you added to your request and what is missing. It does not predict the platform’s decision or promise anything; the final decision rests with the platform alone.", "Un indicateur local montrant ce que vous avez ajouté à votre demande et ce qui manque. Il ne prédit pas la décision de la plateforme et ne promet rien ; la décision finale appartient à la plateforme seule."], ["المعرّف العام للحساب", "The account’s public identifier", "L’identifiant public du compte"], ["تفاصيل الواقعة", "Incident details", "Détails de l’incident"], ["تاريخ ظهور المشكلة", "Date the problem appeared", "Date d’apparition du problème"], ["تأكيد عدم مخالفة الشروط (فقط إن كان صحيحًا)", "Confirmation of no terms violation (only if true)", "Confirmation de l’absence d’infraction aux conditions (uniquement si c’est vrai)"], ["طلبك مكتمل. جهّز إثبات الهوية إن طُلب منك، وقدّم الطلب مرة واحدة فقط عبر القناة الرسمية.", "Your request is complete. Prepare proof of identity if asked, and submit the request only once through the official channel.", "Votre demande est complète. Préparez une preuve d’identité si on vous la demande, et n’envoyez la demande qu’une seule fois via le canal officiel."], ["أضف العناصر الناقصة (إن كانت صحيحة وتعرفها فعلًا) لتوضيح طلبك، ثم قدّمه مرة واحدة عبر القناة الرسمية.", "Add the missing items (only if they are true and you actually know them) to clarify your request, then submit it once through the official channel.", "Ajoutez les éléments manquants (uniquement s’ils sont vrais et que vous les connaissez réellement) pour clarifier votre demande, puis envoyez-la une seule fois via le canal officiel."], ["الإنجليزية هي الأكثر قبولًا لدى فرق الدعم الدولية؛ اختر لغة أخرى إن كانت المنصة تدعمها.", "English is the most widely accepted language for international support teams; choose another language if the platform supports it.", "L’anglais est la langue la plus largement acceptée par les équipes d’assistance internationales ; choisissez une autre langue si la plateforme la prend en charge."], ["المصدر", "Source", "Source"], ["فاحص عروض «فك الحظر»", "“Unban offer” checker", "Vérificateur d’offres de « déblocage »"], ["الصق العرض الذي وصلك من وسيط لتعرف علامات الاحتيال", "Paste an offer you received from an intermediary to spot scam signs", "Collez une offre reçue d’un intermédiaire pour repérer les signes d’arnaque"], ["الصق نص العرض هنا...", "Paste the offer text here...", "Collez le texte de l’offre ici..."], ["افحص العرض", "Check the offer", "Vérifier l’offre"], ["غياب العلامات لا يعني أن العرض آمن.", "The check runs on your device and the text is never sent to any server. No signs found does not mean the offer is safe.", "La vérification s’effectue sur votre appareil et le texte n’est envoyé à aucun serveur. L’absence de signes ne signifie pas que l’offre est sûre."], ["الصق نص العرض أولًا", "Paste the offer text first", "Collez d’abord le texte de l’offre"], ["يعد بـ«ضمان» فك الحظر أو الاسترداد", "Promises a “guaranteed” unban or recovery", "Promet un déblocage ou une récupération « garantis »"], ["يطلب دفعًا أو تحويل رصيد أو عملات رقمية", "Asks for payment, a balance top-up or crypto", "Demande un paiement, une recharge ou des cryptomonnaies"], ["يذكر كلمة المرور أو رمز التحقق (لا يحق لأحد طلبهما)", "Mentions your password or verification code (no one is entitled to ask for them)", "Mentionne votre mot de passe ou code de vérification (personne n’a le droit de les demander)"], ["يطلب تسليمه الحساب أو تحكمًا عن بعد", "Asks you to hand over the account or give remote control", "Demande que vous lui remettiez le compte ou un contrôle à distance"], ["يدّعي علاقة أو واسطة داخل المنصة", "Claims an inside contact or connection at the platform", "Prétend avoir un contact ou une connexion interne à la plateforme"], ["يضغط عليك بالاستعجال أو بعرض محدود", "Pressures you with urgency or a limited offer", "Vous met la pression avec l’urgence ou une offre limitée"], ["يعدك بطريقة سرية أو ثغرة", "Promises a secret method or loophole", "Promet une méthode secrète ou une faille"], ["يطلب صورة هويتك أو وثائقك خارج المنصة", "Asks for your ID or documents outside the platform", "Demande votre pièce d’identité ou vos documents en dehors de la plateforme"], ["رابط مختصر يخفي الوجهة الحقيقية", "Shortened link that hides the real destination", "Lien raccourci qui masque la vraie destination"], ["رابط لا يعود لنطاق رسمي معروف: {d}", "Link that does not belong to a known official domain: {d}", "Lien n’appartenant pas à un domaine officiel connu : {d}"], ["يوجّهك للتواصل خارج المنصة (تلجرام أو واتساب)", "Directs you to communicate off-platform (Telegram or WhatsApp)", "Vous oriente vers une communication hors plateforme (Telegram ou WhatsApp)"], ["خطر مرتفع: تتوفر علامات احتيال واضحة. لا تدفع ولا ترسل أي بيانات.", "High risk: clear scam signs are present. Do not pay and do not send any data.", "Risque élevé : des signes d’arnaque évidents sont présents. Ne payez pas et n’envoyez aucune donnée."], ["مشبوه: تتوفر علامات تستدعي الحذر. تحقق عبر القناة الرسمية فقط.", "Suspicious: there are signs that call for caution. Verify through the official channel only.", "Suspect : des signes appellent à la prudence. Vérifiez uniquement via le canal officiel."], ["علامات قليلة: لم تظهر علامات قوية، لكن تحقق من المصدر قبل أي خطوة.", "Few signs: no strong signs appeared, but verify the source before any step.", "Peu de signes : aucun signe fort n’est apparu, mais vérifiez la source avant toute étape."], ["لم تُكتشف علامات واضحة. هذا لا يعني أن العرض آمن؛ لا تدفع لأحد خارج المنصة ولا تشارك بياناتك.", "No clear signs were detected. That does not mean the offer is safe; do not pay anyone outside the platform and do not share your data.", "Aucun signe évident n’a été détecté. Cela ne signifie pas que l’offre est sûre ; ne payez personne en dehors de la plateforme et ne partagez pas vos données."], ["لا تدفع ولا ترسل كلمة مرور أو رمزًا أو وثائق لأي وسيط. الاستئناف الرسمي يتم عبر المنصة نفسها.", "Do not pay, and do not send a password, code or documents to any intermediary. The official appeal is made through the platform itself.", "Ne payez pas et n’envoyez ni mot de passe, ni code, ni documents à un intermédiaire. L’appel officiel se fait via la plateforme elle-même."], ["ما الذي رصدناه", "What we detected", "Ce que nous avons détecté"], ["تاريخ المتابعة (اختياري)", "Follow-up date (optional)", "Date de suivi (facultatif)"], ["تاريخ المتابعة", "Follow-up date", "Date de suivi"], ["تم حفظ تاريخ المتابعة", "Follow-up date saved", "Date de suivi enregistrée"], ["حان موعد المتابعة", "Time to follow up", "Il est temps de faire le suivi"], ["إضافة للتقويم", "Add to calendar", "Ajouter au calendrier"], ["متابعة طلب الاستئناف: {p}", "Follow up on appeal: {p}", "Suivi de l’appel : {p}"], ["افتح التطبيق الرسمي وتحقق من حالة طلبك. لا تُرسل أي طلب جديد قبل ذلك.", "Open the official app and check the status of your request. Do not submit a new request before that.", "Ouvrez l’application officielle et vérifiez l’état de votre demande. N’envoyez pas de nouvelle demande avant cela."]].forEach(r => { DICT.en[r[0]] = r[1]; DICT.fr[r[0]] = r[2]; });
const nrm = x => String(x).trim().replace(/\s+/g, ' ');
function tx(s, v) {
  let r = s;
  if (uiLang !== 'ar') { const d = DICT[uiLang][s]; if (d !== undefined) r = d; }
  return v ? r.replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : m) : r;
}
const ask = s => window.confirm(tx(s));
const txtOrig = new WeakMap(), attrOrig = new WeakMap(), ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
const TITLE_AR = document.title, metaDesc = document.querySelector('meta[name="description"]'), DESC_AR = metaDesc ? metaDesc.getAttribute('content') : '';
function applyDom() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => {
    const par = n.parentNode && n.parentNode.nodeName;
    if (par === 'SCRIPT' || par === 'STYLE' || par === 'TEXTAREA') return;
    let o = txtOrig.get(n);
    if (o === undefined) {
      const k0 = nrm(n.nodeValue);
      if (!k0 || DICT.en[k0] === undefined) return;
      o = n.nodeValue; txtOrig.set(n, o);
    }
    if (uiLang === 'ar') { if (n.nodeValue !== o) n.nodeValue = o; return; }
    const d = DICT[uiLang][nrm(o)];
    n.nodeValue = d === undefined ? o : o.match(/^\s*/)[0] + d + o.match(/\s*$/)[0];
  });
  document.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(el => {
    let m = attrOrig.get(el); if (!m) { m = {}; attrOrig.set(el, m); }
    ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      if (m[a] === undefined) { const v = el.getAttribute(a); if (DICT.en[nrm(v)] === undefined) return; m[a] = v; }
      const d = uiLang === 'ar' ? undefined : DICT[uiLang][nrm(m[a])];
      el.setAttribute(a, d === undefined ? m[a] : d);
    });
  });
  document.title = (uiLang !== 'ar' && DICT[uiLang][nrm(TITLE_AR)]) || TITLE_AR;
  if (metaDesc) metaDesc.setAttribute('content', (uiLang !== 'ar' && DICT[uiLang][nrm(DESC_AR)]) || DESC_AR);
}
const backLabel = () => tx(stage === 2 ? '→ تغيير المنصة' : '→ تعديل البيانات');
function rerender() {
  const p = sel ? P[sel] : null;
  buildPlats(); renderHome(); renderAlerts(); renderHelp(); buildLogFilter(); ipRender();
  if (stage > 1) $('btnBack').textContent = backLabel();
  if (p) {
    $('fName').textContent = p.name;
    $('idLabel').textContent = tx('{type} (المعرّف العام)', { type: tx(TL[p.type]) });
    buildIssues(); showDiag(true); onIdInput();
  }
  $('noTpl').classList.remove('show');
  if (stage === 3 && p && issue) resultText();
  if (curPage === 'log') renderLog();
  ocrReset();
  if ($('scamOut').children.length && $('scamIn').value.trim()) runScam();
}
function setLang(l, persist) {
  if (!LANGS[l]) l = 'ar';
  uiLang = l;
  if (persist !== false) { try { localStorage.setItem(K.LANG, l); } catch (e) {} }
  const d = document.documentElement; d.setAttribute('lang', l); d.setAttribute('dir', LANGS[l].dir);
  $('langCode').textContent = LANGS[l].code;
  document.querySelectorAll('#langMenu [data-lang]').forEach(b => { const on = b.dataset.lang === l; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  applyDom();
  rerender();
}
const langBtn = $('langBtn'), langMenu = $('langMenu');
function langMenuOpen(open) { langMenu.hidden = !open; langBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
langBtn.addEventListener('click', e => { e.stopPropagation(); langMenuOpen(langMenu.hidden); });
langMenu.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { setLang(b.dataset.lang); langMenuOpen(false); langBtn.focus(); }));
document.addEventListener('click', e => { if (!langMenu.hidden && !langMenu.contains(e.target)) langMenuOpen(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !langMenu.hidden) { langMenuOpen(false); langBtn.focus(); } });

/* ---------- theme ---------- */
const mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function storedTheme() { try { const t = localStorage.getItem(K.THEME); return t === 'light' || t === 'dark' ? t : null; } catch (e) { return null; } }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const m = document.getElementById('themeColor'); if (m) m.setAttribute('content', t === 'dark' ? '#000000' : '#f5f5f5');
}
function systemTheme() { return mq && mq.matches ? 'dark' : 'light'; }
applyTheme(storedTheme() || systemTheme());
$('themeBtn').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(K.THEME, next); } catch (e) {}
  applyTheme(next);
});
if (mq && mq.addEventListener) mq.addEventListener('change', () => { if (!storedTheme()) applyTheme(systemTheme()); });

/* ---------- platforms ---------- */
const P = {};
function add(cat, rows) {
  rows.trim().split('\n').forEach(r => {
    const [k, name, icon, type, ph, help, flag] = r.trim().split('|');
    if (k) P[k] = { k, name, icon, type, ph, cat, help: help || null, cand: !!flag && flag.includes('c'), sp: !!flag && flag.includes('s'), iss: null };
  });
}
const B = 'fa-brands fa-', G = 'fa-solid fa-gamepad';
add('social', `
tiktok|TikTok|${B}tiktok|username|@username|https://support.tiktok.com
instagram|Instagram|${B}instagram|username|@username|https://help.instagram.com
whatsapp|WhatsApp|${B}whatsapp|phone|213XXXXXXXXX|https://faq.whatsapp.com
twitter|X (Twitter)|${B}twitter|username|@username|https://help.x.com
facebook|Facebook|${B}facebook|email_or_user|example@fb.com|https://www.facebook.com/help
messenger|Messenger|${B}facebook-messenger|email_or_user|example@fb.com|https://www.facebook.com/help/messenger-app/|c
snapchat|Snapchat|${B}snapchat|username|@username|https://help.snapchat.com
telegram|Telegram|${B}telegram|phone|213XXXXXXXXX|https://telegram.org/faq
discord|Discord|${B}discord|username|username|https://support.discord.com
youtube|YouTube|${B}youtube|email_or_user|example@gmail.com|https://support.google.com/youtube
gmail|Gmail / Google|${B}google|email|example@gmail.com|https://support.google.com/accounts
reddit|Reddit|${B}reddit|username|u/username|https://support.reddithelp.com
pinterest|Pinterest|${B}pinterest|email|example@email.com|https://help.pinterest.com
line|LINE|${B}line|phone|213XXXXXXXXX|https://help.line.me
viber|Viber|${B}viber|phone|213XXXXXXXXX|https://help.viber.com`);
add('game', `
freefire|Free Fire|${G}|id|123456789|https://ffsupport.garena.com/|c
pubg|PUBG Mobile|${G}|id|512345678|https://www.pubgmobile.com/en-US/support|c
fortnite|Fortnite|${G}|username|Epic-username|https://www.epicgames.com/help|s
codm|Call of Duty: Mobile|${G}|id|67451234|https://support.activision.com/call-of-duty-mobile|c
mlbb|Mobile Legends|${G}|id|123456789|https://support.mobilelegends.com/|c
brawlstars|Brawl Stars|${G}|id|#ABC123|https://supercell.com/en/support/|c
clashofclans|Clash of Clans|${G}|id|#ABC123|https://supercell.com/en/support/|c
clashroyale|Clash Royale|${G}|id|#ABC123|https://supercell.com/en/support/|c
wildrift|Wild Rift|${G}|id|username#tag|https://support-wildrift.riotgames.com/|cs
roblox|Roblox|${G}|username|username|https://en.help.roblox.com
minecraft|Minecraft|${G}|username|username|https://help.minecraft.net
genshin|Genshin Impact|${G}|id|123456789|https://genshin.hoyoverse.com/en/help|c
eafc|EA SPORTS FC Mobile|${G}|id|123456789|https://help.ea.com
efootball|eFootball|${G}|id|123456789|https://support.konami.net/hc/en-us|c
honorofkings|Honor of Kings|${G}|id|123456789|https://www.honorofkings.com/en/|c
stumbleguys|Stumble Guys|${G}|id|123456789|https://www.stumbleguys.com/|c
amongus|Among Us|${G}|username|username|https://innersloth.com/support/|cs`);
['whatsapp', 'telegram', 'line', 'viber'].forEach(k => P[k].iss = ['login', 'banned', 'recovery', 'other']);
const AR = { tiktok:'تيك توك', instagram:'انستغرام انستجرام إنستغرام', whatsapp:'واتساب واتس اب', twitter:'تويتر اكس إكس', facebook:'فيسبوك فيس بوك', messenger:'ماسنجر', snapchat:'سناب شات سناب', telegram:'تلجرام تيليجرام تلغرام', discord:'ديسكورد', youtube:'يوتيوب', gmail:'جيميل جوجل قوقل غوغل', reddit:'ريديت', pinterest:'بنترست', line:'لاين', viber:'فايبر', freefire:'فري فاير', pubg:'ببجي', fortnite:'فورتنايت', codm:'كول اوف ديوتي كود', mlbb:'موبايل ليجندز', brawlstars:'براول ستارز', clashofclans:'كلاش اوف كلانس', clashroyale:'كلاش رويال', wildrift:'وايلد ريفت', roblox:'روبلوكس', minecraft:'ماين كرافت ماينكرافت', genshin:'جينشن', eafc:'فيفا', efootball:'بيس', honorofkings:'هونر اوف كينجز', stumbleguys:'ستامبل جايز', amongus:'امونج اس' };
const TL = { username: 'اسم المستخدم', phone: 'رقم الهاتف', email: 'البريد الإلكتروني', email_or_user: 'البريد أو اسم المستخدم', id: 'معرّف اللاعب' };
const SOC_ISS = ['login', 'disabled', 'banned', 'recovery', 'other'], GAME_ISS = ['login', 'ingame', 'recovery', 'other'];
const issuesOf = p => p.iss || (p.cat === 'game' ? GAME_ISS : SOC_ISS);
const NOTICE = ['وصلني إشعار رسمي', 'لم يصلني أي إشعار'];
const ISS = {
  login: { n: 'تعذر تسجيل الدخول', q: [
    ['تظهر رسالة تعطيل أو حظر', 'اختر نوع المشكلة {ban} بدل هذا الخيار.'],
    ['كلمة المرور لا تعمل', 'استخدم خيار «نسيت كلمة المرور» من التطبيق أو الموقع الرسمي فقط.'],
    ['لا يصلني رمز التحقق', 'تأكد من الرقم أو البريد، وتحقق من الرسائل غير المرغوبة، ثم استخدم خيار إعادة الإرسال الرسمي.'],
    ['لا أعرف السبب', 'حدّث التطبيق، أعد تشغيل الجهاز، وجرّب شبكة مختلفة قبل مراسلة الدعم.']] },
  disabled: { n: 'تعطيل الحساب', q: [
    [NOTICE[0], 'راجع نص الإشعار واحتفظ بلقطة شاشة؛ فهو المصدر الوحيد لسبب القرار.'],
    [NOTICE[1], 'لا يستطيع هذا التطبيق معرفة السبب. افحص بريدك (والرسائل غير المرغوبة) وخيارات المساعدة داخل المنصة.']] },
  banned: { n: 'حظر الحساب أو تقييده', q: [
    [NOTICE[0], 'راجع نص الإشعار واحتفظ بلقطة شاشة؛ فهو المصدر الوحيد لسبب القرار.'],
    [NOTICE[1], 'لا يمكن تحديد سبب الحظر من المعرّف وحده. ارجع إلى إشعارات المنصة الرسمية.']] },
  recovery: { n: 'مشكلة تحقق أو استرداد الحساب', q: [
    ['فقدت الوصول إلى البريد أو الرقم', 'ابدأ من صفحة الاسترداد الرسمية ولا تُعطِ بياناتك لأي وسيط.'],
    ['طُلبت مني وثيقة هوية', 'قدّمها داخل القناة الرسمية فقط وعند طلبها، ولا ترسلها لموقع آخر.']] },
  ingame: { n: 'حظر أو عقوبة داخل اللعبة', q: [
    ['ظهر لي إشعار داخل اللعبة', 'دوّن نص الإشعار ومدته؛ الناشر وحده يحدد السبب.'],
    ['لا أعرف سبب العقوبة', 'لا يمكن تحديد السبب من المعرّف وحده. اطلب التوضيح من دعم الناشر الرسمي.']] },
  other: { n: 'مشكلة أخرى', q: [] }
};

const IN = k => tx(ISS[k].n);

/* ---------- message templates ---------- */
const T = {
  ar: { fx: 'نقاط متعلقة بالحالة:', hi: 'فريق دعم {p} المحترم،', id: 'المعرّف المرتبط بالحساب', date: 'تاريخ ظهور المشكلة', det: 'تفاصيل إضافية', claim: 'بحسب علمي لم أخالف شروط الخدمة، وأرجو مراجعة القرار.',
    ask: 'أرجو مراجعة حالة الحساب وإفادتي بالخطوات المناسبة.', askL: 'كما أرجو توضيح سبب القرار إن أمكن.', ext: 'يسعدني تزويدكم بأي معلومات إضافية تثبت ملكيتي للحساب عبر القناة الرسمية.', bye: 'مع الشكر والتقدير.',
    i: { login: 'أواجه مشكلة في تسجيل الدخول إلى حسابي على {p}.', disabled: 'تم تعطيل حسابي على {p} وأرغب في معرفة الخطوات المتاحة لمراجعة القرار.', banned: 'تم حظر حسابي أو تقييده على {p} وأرغب في طلب مراجعة.', recovery: 'أواجه مشكلة في التحقق من حسابي أو استرداده على {p}.', ingame: 'تعرّض حسابي في {p} لحظر أو عقوبة وأرغب في طلب مراجعة.', other: 'أتواصل معكم بخصوص مشكلة تتعلق بحسابي على {p}.' } },
  en: { fx: 'Relevant points:', hi: 'Dear {p} Support Team,', id: 'Account identifier', date: 'Date the issue started', det: 'Additional details', claim: 'To the best of my knowledge I have not violated the terms of service, and I kindly ask for a review.',
    ask: 'Please review the account status and let me know the appropriate next steps.', askL: 'If possible, please also explain the reason for the decision.', ext: 'I am glad to provide any further information through the official channel to confirm ownership of the account.', bye: 'Thank you for your time.',
    i: { login: 'I am having trouble logging in to my {p} account.', disabled: 'My {p} account was disabled and I would like to know the available steps to have the decision reviewed.', banned: 'My {p} account was banned or restricted and I would like to request a review.', recovery: 'I am having trouble verifying or recovering my {p} account.', ingame: 'My account in {p} received a ban or penalty and I would like to request a review.', other: 'I am contacting you about an issue with my {p} account.' } },
  fr: { fx: 'Points à signaler :', hi: "Chère équipe d'assistance {p},", id: 'Identifiant du compte', date: "Date d'apparition du problème", det: 'Détails supplémentaires', claim: "À ma connaissance, je n'ai pas enfreint les conditions d'utilisation et je demande un réexamen.",
    ask: "Merci d'examiner l'état du compte et de m'indiquer les démarches à suivre.", askL: 'Si possible, merci aussi de préciser le motif de la décision.', ext: 'Je peux fournir toute information complémentaire via le canal officiel afin de confirmer la propriété du compte.', bye: 'Merci pour votre temps.',
    i: { login: 'Je rencontre un problème de connexion à mon compte {p}.', disabled: "Mon compte {p} a été désactivé et je souhaite connaître les démarches pour demander un réexamen.", banned: 'Mon compte {p} a été banni ou restreint et je souhaite demander un réexamen.', recovery: 'Je rencontre un problème pour vérifier ou récupérer mon compte {p}.', ingame: 'Mon compte dans {p} a reçu un bannissement ou une sanction et je souhaite demander un réexamen.', other: "Je vous contacte au sujet d'un problème concernant mon compte {p}." } }
};
/* ---------- neutral facts (user picks only what applies) ---------- */
const FACTS = {
  nonotice: { ar: 'لم يصلني إشعار واضح يشرح سبب القرار.', en: 'I did not receive a clear notice explaining the reason for the decision.', fr: "Je n'ai pas reçu de notification claire expliquant le motif de la décision." },
  vague: { ar: 'الإشعار الذي وصلني لا يحدد المخالفة المزعومة بوضوح.', en: 'The notice I received does not clearly specify the alleged violation.', fr: "La notification reçue ne précise pas clairement l'infraction alléguée." },
  reports: { ar: 'ذكر الإشعار أن القرار مرتبط ببلاغات على الحساب.', en: 'The notice mentioned that the decision was related to reports on the account.', fr: 'La notification indiquait que la décision était liée à des signalements sur le compte.' },
  regular: { ar: 'كنت أستخدم الحساب بشكل اعتيادي قبل ظهور المشكلة.', en: 'I was using the account normally before the issue appeared.', fr: "J'utilisais le compte normalement avant l'apparition du problème." },
  mistake: { ar: 'أعتقد أن القرار قد يكون تم بالخطأ، وأرجو مراجعته.', en: 'I believe the decision may have been made in error and kindly ask for a review.', fr: 'Je pense que la décision a pu être prise par erreur et je demande un réexamen.' },
  suspicious: { ar: 'لاحظت نشاطًا على الحساب لم أقم به بنفسي (مثل تسجيل دخول لا أعرفه).', en: 'I noticed activity on the account that I did not perform myself (for example, a login I do not recognize).', fr: "J'ai remarqué sur le compte une activité que je n'ai pas effectuée moi-même (par exemple une connexion inconnue)." },
  lostaccess: { ar: 'فقدت الوصول إلى البريد أو الرقم المرتبط بالحساب.', en: 'I no longer have access to the email address or phone number linked to the account.', fr: "Je n'ai plus accès à l'adresse e-mail ou au numéro de téléphone associé au compte." },
  owner: { ar: 'يمكنني تقديم معلومات تؤكد ملكيتي للحساب عبر القناة الرسمية.', en: 'I can provide information confirming my ownership of the account through the official channel.', fr: 'Je peux fournir des informations confirmant que je suis le titulaire du compte via le canal officiel.' }
};
const FACT_ORDER = Object.keys(FACTS);
const FACT_BY_ISSUE = {
  disabled: ['nonotice', 'vague', 'reports', 'regular', 'mistake', 'suspicious', 'owner'],
  banned: ['nonotice', 'vague', 'reports', 'regular', 'mistake', 'suspicious', 'owner'],
  ingame: ['nonotice', 'vague', 'reports', 'regular', 'mistake', 'owner'],
  login: ['regular', 'suspicious', 'lostaccess', 'owner'],
  recovery: ['lostaccess', 'suspicious', 'owner'],
  other: []
};
const FACT_CONFLICT = { nonotice: ['vague', 'reports'], vague: ['nonotice'], reports: ['nonotice'] };
function buildFacts() {
  const box = $('factsBox'), list = $('factsList'); list.replaceChildren();
  const avail = FACT_BY_ISSUE[issue] || [];
  box.style.display = avail.length ? '' : 'none';
  Array.from(facts).forEach(k => { if (!avail.includes(k)) facts.delete(k); });
  avail.forEach(k => {
    const cb = h('input', { type: 'checkbox', id: 'fx_' + k }); cb.checked = facts.has(k);
    cb.addEventListener('change', () => {
      if (cb.checked) { facts.add(k); (FACT_CONFLICT[k] || []).forEach(x => facts.delete(x)); } else facts.delete(k);
      buildFacts(); const f = $('fx_' + k); if (f) f.focus();
    });
    list.appendChild(h('label', { cls: 'chk' }, cb, h('span', { text: FACTS[k][uiLang] })));
  });
}
function detCheck() { const w = $('detWarn'); if (w) w.classList.toggle('show', sensitive($('detIn').value)); }

function genMsg(o) {
  const t = T[o.lang], f = s => s.replace('{p}', o.plat.name);
  const L = [f(t.hi), '', f(t.i[o.issue])];
  L.push('', t.id + ': ' + o.id);
  if (o.date) L.push(t.date + ': ' + o.date);
  const fk = FACT_ORDER.filter(k => (o.facts || []).includes(k) && (FACT_BY_ISSUE[o.issue] || []).includes(k));
  if (fk.length) { L.push('', t.fx); fk.forEach(k => L.push('- ' + FACTS[k][o.lang])); }
  if (o.det) L.push('', t.det + ':', o.det);
  const dec = DECISION.includes(o.issue);
  if (o.claim && dec) L.push('', t.claim);
  L.push('', t.ask);
  if (o.style === 'long') { if (dec) L.push(t.askL); L.push('', t.ext); }
  L.push('', t.bye);
  return L.join('\n');
}

/* ---------- validation / safety ---------- */
const NAME_RE = /^[\p{L}\p{N}@._\-#]+$/u;
function nameOk(t, sp) { return (sp ? (t.match(/ /g) || []).length <= 3 : true) && NAME_RE.test(sp ? t.replace(/ /g, '_') : t); }
function validInput(v, type, sp) {
  const t = (v || '').trim(); if (!t) return false;
  if (type === 'phone') { if (!/^\+?[\d\s\-().]+$/.test(t)) return false; const d = t.replace(/\D/g, ''); return d.length >= 9 && d.length <= 15; }
  if (type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
  if (type === 'email_or_user') return t.length >= 2 && t.length <= 60 && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) || nameOk(t, sp));
  if (type === 'id') return t.length >= 3 && t.length <= 60 && nameOk(t, sp);
  return t.length >= 2 && t.length <= 60 && nameOk(t, sp);
}
const ERR = { phone: 'يرجى إدخال رقم هاتف صحيح (أرقام فقط، من 9 إلى 15 رقمًا).', email: 'يرجى إدخال بريد إلكتروني صحيح.', id: 'يرجى إدخال معرّف اللاعب (3-60 حرفًا).', username: 'يرجى إدخال اسم مستخدم صحيح (2-60 حرفًا).', email_or_user: 'يرجى إدخال بريد أو اسم مستخدم صحيح.' };
const ERR_SENS = 'يبدو أن الحقل يحتوي كلمة مرور أو رمزًا. احذفه وأدخل المعرّف العام فقط.';
const ERR_SPACE = 'المعرّف لا يجب أن يحتوي مسافات أو نصًا إضافيًا. أدخل المعرّف العام فقط.';
const SENS = /(password|passcode|\bpass\d+|\bpwd\b|\bpin\s*[:=]?\s*\d{4,8}\b|\botp\b|2fa|verification code|recovery code|security code|(?:code|token|رمز|كود)\s*[:=]?\s*\d{4,8}\b|كلمة\s*(ال)?(مرور|سر)|باسورد|باسوورد|رمز\s*(التحقق|الاسترداد|الأمان|المصادقة)|mot de passe|code de (v[ée]rification|r[ée]cup[ée]ration|s[ée]curit[ée]))/i;
function luhn(d) { let sum = 0, alt = false; for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; } return sum % 10 === 0; }
function hasCard(t) { return (t.match(/(?:\d[ -]?){13,19}/g) || []).some(m => { const d = m.replace(/\D/g, ''); return d.length >= 13 && d.length <= 19 && luhn(d); }); }
const sensitive = s => SENS.test(s || '') || hasCard(s || '');

/* ---------- state ---------- */
const fav = (() => { const v = load(K.FAV, []); return Array.isArray(v) ? v.filter(k => typeof k === 'string' && P[k]) : []; })();
let lastPlat = (() => { const v = load(K.LAST, null); return typeof v === 'string' && P[v] ? v : null; })();
let rating = (() => { const v = load(K.RATING, 0); return Number.isInteger(v) && v >= 0 && v <= 5 ? v : 0; })();
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
let sel = null, issue = null, curId = null, dirty = false, lastGen = '', stage = 1, curPage = 'home';
const facts = new Set();

/* ---------- log storage ---------- */
const ST = { draft: 'مسودة', ready: 'جاهز للإرسال', sent: 'أرسلته بنفسي', waiting: 'بانتظار الرد', closed: 'انتهت المتابعة' };
function cleanRec(r) {
  if (!r || typeof r !== 'object') return null;
  const s = (v, n) => typeof v === 'string' ? v.slice(0, n) : '';
  if (typeof r.id !== 'string' || !/^[\w-]{1,40}$/.test(r.id) || !P[r.plat] || !ISS[r.issue] || !ST[r.status] || !T[r.lang] || typeof r.text !== 'string' || !r.text.trim()) return null;
  const c = Number(r.created), u = Number(r.updated);
  if (!isFinite(c) || !isFinite(u)) return null;
  return { id: r.id, plat: r.plat, issue: r.issue, status: r.status, lang: r.lang, text: r.text.slice(0, LIM.text), notes: s(r.notes, LIM.notes), uid: s(r.uid, 60), follow: /^\d{4}-\d{2}-\d{2}$/.test(r.follow) ? r.follow : '', created: c, updated: u };
}
let logRecs = (() => { const v = load(K.LOG, []); return Array.isArray(v) ? v.map(cleanRec).filter(Boolean).slice(0, LIM.recs) : []; })();
const saveLog = () => save(K.LOG, logRecs);
const fmt = ts => new Date(ts).toLocaleString(LOCALE[uiLang], { dateStyle: 'medium', timeStyle: 'short' });

/* ---------- navigation ---------- */
function navTo(p) {
  if (!$('page-' + p)) return;
  curPage = p;
  document.querySelectorAll('.page').forEach(x => x.classList.toggle('active', x.id === 'page-' + p));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === p));
  $('mainScroll').scrollTop = 0;
  if (p === 'log') renderLog();
  if (p === 'home') renderHome();
}
document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => navTo(n.dataset.page)));
window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

/* ---------- stages ---------- */
function setStage(n) {
  stage = n;
  $('platformCard').style.display = n === 1 ? '' : 'none';
  $('formCard').style.display = n === 2 ? '' : 'none';
  $('resultBox').classList.toggle('show', n === 3);
  $('btnBack').style.display = n > 1 ? 'inline-flex' : 'none';
  $('btnBack').textContent = backLabel();
  [1, 2, 3].forEach(i => { const e = $('si' + i); e.classList.toggle('active', i === n); e.classList.toggle('done', i < n); });
  $('siLine1').classList.toggle('done', n > 1); $('siLine2').classList.toggle('done', n > 2);
  $('mainScroll').scrollTop = 0;
}
$('btnBack').addEventListener('click', () => setStage(stage - 1));

/* ---------- platform list ---------- */
function platBtn(p) {
  const fb = h('button', { cls: 'plat-fav' + (fav.includes(p.k) ? ' active' : ''), type: 'button', 'aria-label': tx('إضافة {p} إلى المفضلة', { p: p.name }), 'aria-pressed': fav.includes(p.k) ? 'true' : 'false' }, h('i', { cls: 'fa-solid fa-star' }));
  fb.addEventListener('click', e => { e.stopPropagation(); toggleFav(p.k); });
  fb.addEventListener('keydown', e => e.stopPropagation());
  const b = h('div', { cls: 'plat-btn' + (p.k === lastPlat ? ' last-used' : '') + (p.k === sel ? ' sel' : ''), role: 'button', tabindex: '0', 'aria-label': p.name, 'data-last': tx('الأخير') },
    h('div', { cls: 'plat-icon' }, h('i', { cls: p.icon })),
    h('div', { cls: 'plat-info' }, h('span', { cls: 'plat-name', text: p.name }), h('span', { cls: 'plat-hint', text: tx(p.cat === 'game' ? 'لعبة' : 'شبكة اجتماعية') })),
    fb,
    h('div', { cls: 'plat-check' }, h('i', { cls: 'fa-solid fa-check' })));
  b.addEventListener('click', () => selectPlat(p.k));
  b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPlat(p.k); } });
  return b;
}
function buildPlats() {
  const ft = $('searchInput').value.toLowerCase().trim();
  const rows = { fav: $('rowFav'), social: $('rowSocial'), game: $('rowGames') };
  Object.values(rows).forEach(r => r.replaceChildren());
  let n = 0;
  Object.values(P).forEach(p => { if (ft && !(p.name + ' ' + p.k + ' ' + (AR[p.k] || '')).toLowerCase().includes(ft)) return; rows[p.cat].appendChild(platBtn(p)); n++; });
  const showFav = fav.length > 0 && !ft;
  $('favSection').style.display = showFav ? 'block' : 'none';
  if (showFav) fav.forEach(k => rows.fav.appendChild(platBtn(P[k])));
  $('noPlat').style.display = n ? 'none' : 'block';
}
function toggleFav(k) { const i = fav.indexOf(k); if (i > -1) fav.splice(i, 1); else fav.push(k); save(K.FAV, fav); buildPlats(); }
$('searchInput').addEventListener('input', buildPlats);

/* ---------- form ---------- */
function selectPlat(k, keep) {
  const p = P[k]; if (!p) return;
  if (!keep && sel !== k && dirty && !ask('لديك مسودة غير محفوظة ستُستبدل. المتابعة؟')) return;
  if (sel !== k) { issue = null; curId = null; dirty = false; $('msgEdit').value = ''; lastGen = ''; $('userInput').value = ''; $('userInput').classList.remove('invalid'); $('inputErr').classList.remove('show'); $('detIn').value = ''; $('claimIn').checked = false; facts.clear(); ocrReset(); }
  $('dateIn').max = todayStr();
  sel = k; lastPlat = k; save(K.LAST, k); buildPlats();
  $('fName').textContent = p.name; $('fIcon').className = p.icon;
  $('idLabel').textContent = tx('{type} (المعرّف العام)', { type: tx(TL[p.type]) });
  $('userInput').placeholder = p.ph; $('userInput').type = p.type === 'phone' ? 'tel' : p.type === 'email' ? 'email' : 'text';
  $('inputIcon').className = 'fa-solid ' + (p.type === 'phone' ? 'fa-phone' : p.type === 'email' ? 'fa-envelope' : 'fa-user');
  buildIssues(); showDiag(); $('noTpl').classList.remove('show'); setStage(2);
}
function buildIssues() {
  const g = $('issueGrid'); g.replaceChildren();
  issuesOf(P[sel]).forEach(k => g.appendChild(h('button', { cls: 'reason-btn' + (k === issue ? ' sel' : ''), type: 'button', text: IN(k), onclick: () => { issue = k; buildIssues(); showDiag(); $('noTpl').classList.remove('show'); } })));
}
const DECISION = ['disabled', 'banned', 'ingame'];
function banNames() { return issuesOf(P[sel]).filter(k => DECISION.includes(k)).map(k => '«' + IN(k) + '»').join(' ' + tx('أو') + ' '); }
let diagIdx = -1;
function showDiagTip(tip) { $('diagTip').textContent = tx(tip).replace('{ban}', banNames()); $('diagTip').style.display = 'block'; }
function showDiag(keep) {
  buildFacts(); detCheck();
  $('claimRow').style.display = DECISION.includes(issue) ? '' : 'none';
  if (!keep) diagIdx = -1;
  const g = $('diagGrid'); g.replaceChildren(); $('diagTip').style.display = 'none';
  const qs = issue ? ISS[issue].q : [];
  $('diag').style.display = qs.length ? '' : 'none';
  qs.forEach(([l, tip], i) => g.appendChild(h('button', { cls: 'reason-btn' + (i === diagIdx ? ' sel' : ''), type: 'button', text: tx(l), onclick: e => { diagIdx = i; g.querySelectorAll('.reason-btn').forEach(x => x.classList.remove('sel')); e.currentTarget.classList.add('sel'); showDiagTip(tip); } })));
  if (diagIdx > -1 && qs[diagIdx]) showDiagTip(qs[diagIdx][1]);
}
function idProblem(v, p) {
  if (!v) return '';
  if (SENS.test(v) || (p.type !== 'phone' && hasCard(v))) return ERR_SENS;
  if (!validInput(v, p.type, p.sp)) return (p.type !== 'phone' && /\s/.test(v)) ? ERR_SPACE : ERR[p.type];
  return '';
}
function onIdInput() {
  const v = $('userInput').value.trim(), p = P[sel];
  const msg = p ? idProblem(v, p) : '';
  $('userInput').classList.toggle('invalid', !!msg);
  $('inputErr').textContent = tx(msg); $('inputErr').classList.toggle('show', !!msg);
}
$('userInput').addEventListener('input', onIdInput);
$('detIn').addEventListener('input', detCheck);

function generate() {
  const p = P[sel], err = $('noTpl'); err.classList.remove('show');
  const fail = m => { if (stage !== 2) setStage(2); err.textContent = tx(m); err.classList.add('show'); };
  if (!issue) return fail('اختر نوع المشكلة أولًا.');
  const id = $('userInput').value.trim().slice(0, 60), det = $('detIn').value.trim();
  const ip = idProblem(id, p); if (ip) { onIdInput(); return fail(ip); }
  if (sensitive(det)) { detCheck(); return fail('حقل التفاصيل يبدو أنه يتضمن معلومة حساسة (كلمة مرور أو رمز أو رقم بطاقة). احذفها ثم أعد المحاولة.'); }
  if (issue === 'other' && !det) return fail('لا يوجد قالب مناسب لهذه الحالة. صف مشكلتك في «تفاصيل الواقعة» لتجهيز رسالة، أو راجع مركز المساعدة الرسمي.');
  const d = $('dateIn').value;
  if (d && d > todayStr()) return fail('تاريخ ظهور المشكلة لا يمكن أن يكون في المستقبل.');
  const ta = $('msgEdit');
  if (ta.value && ta.value !== lastGen && !ask('عدّلت الرسالة يدويًا. إعادة الإنشاء ستستبدل تعديلاتك. المتابعة؟')) return;
  lastGen = genMsg({ plat: p, issue, id, date: /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '', det, facts: Array.from(facts), claim: $('claimIn').checked, lang: $('langIn').value, style: $('styleIn').value });
  ta.value = lastGen; dirty = true; showResult();
}
/* ---------- request completeness (local, no prediction) ---------- */
function predictScore(o) {
  const items = [[tx('المعرّف العام للحساب'), true], [tx('تفاصيل الواقعة'), !!o.det], [tx('تاريخ ظهور المشكلة'), !!o.date]];
  if (DECISION.includes(o.issue)) items.push([tx('تأكيد عدم مخالفة الشروط (فقط إن كان صحيحًا)'), !!o.claim]);
  return { done: items.filter(i => i[1]).length, total: items.length, items };
}
function renderPred() {
  const d = $('detIn').value.trim(), dt = $('dateIn').value;
  const r = predictScore({ issue, claim: $('claimIn').checked, det: d, date: dt });
  const pct = Math.round(r.done / r.total * 100), bar = $('predBar');
  bar.className = 'pred-bar' + (pct >= 100 ? ' hi' : pct >= 60 ? ' mid' : '');
  bar.style.width = '0%'; void bar.offsetWidth; bar.style.width = pct + '%';
  $('predPct').textContent = r.done + '/' + r.total; $('predTrack').setAttribute('aria-valuenow', String(pct));
  $('predTxt').textContent = tx(r.done === r.total ? 'طلبك مكتمل. جهّز إثبات الهوية إن طُلب منك، وقدّم الطلب مرة واحدة فقط عبر القناة الرسمية.' : 'أضف العناصر الناقصة (إن كانت صحيحة وتعرفها فعلًا) لتوضيح طلبك، ثم قدّمه مرة واحدة عبر القناة الرسمية.');
  const ul = $('predWhy'); ul.replaceChildren();
  r.items.forEach(w => ul.appendChild(h('li', { text: (w[1] ? '✓ ' : '✗ ') + w[0] })));
}

/* ---------- live ban alerts (static data: edit by hand) ---------- */
// Each alert MUST include src (https link to an official or reliable report). Entries without a source are never shown.
// Format: { platform, type, tip, date: 'YYYY-MM-DD', src: 'https://...', en: {platform,type,tip}, fr: {platform,type,tip} }
const BAN_ALERTS = [];
const ALERT_STALE_DAYS = 45, ALERT_KEY = 'unlock_dz_alerts';
const shownAlerts = () => BAN_ALERTS.filter(a => a.src && /^https:\/\//.test(a.src));
function alertSig() { return shownAlerts().map(a => a.platform + a.type + a.tip + a.date).join('|'); }
function alertsDismissed() { try { return localStorage.getItem(ALERT_KEY) === alertSig(); } catch (e) { return false; } }
function renderAlerts() {
  const box = $('alerts'); box.replaceChildren();
  if (!shownAlerts().length || alertsDismissed()) { box.hidden = true; return; }
  box.hidden = false;
  const x = h('button', { cls: 'alerts-x', type: 'button', 'aria-label': tx('إغلاق التنبيهات') }, h('i', { cls: 'fa-solid fa-xmark' }), ' ' + tx('إغلاق'));
  x.addEventListener('click', () => { try { localStorage.setItem(ALERT_KEY, alertSig()); } catch (e) {} box.hidden = true; });
  box.appendChild(h('div', { cls: 'alerts-head' }, h('b', {}, h('i', { cls: 'fa-solid fa-bell' }), ' ' + tx('أحدث تنبيهات الحظر (إرشادية)')), x));
  const row = h('div', { cls: 'alerts-row' });
  shownAlerts().sort((a, b) => b.date.localeCompare(a.date)).forEach(a => {
    const old = dayAge(a.date) > ALERT_STALE_DAYS, loc = (uiLang !== 'ar' && a[uiLang]) || a;
    row.appendChild(h('div', { cls: 'alert-card' },
      h('div', { cls: 'ah' }, h('b', { text: loc.platform }), h('span', { cls: 'ad', text: dayFmt(a.date) })),
      h('div', { cls: 'at', text: loc.type }),
      h('div', { cls: 'tp' }, h('i', { cls: 'fa-solid fa-lightbulb' }), ' ' + loc.tip),
      h('a', { cls: 'lnk-u', href: a.src, target: '_blank', rel: 'noopener noreferrer', text: tx('المصدر') }),
      old ? h('div', { cls: 'old', text: tx('تنبيه قديم، قد لا يكون ساريًا الآن.') }) : null));
  });
  box.appendChild(row);
}
renderAlerts();

function resultText() {
  const p = P[sel];
  $('resMeta').textContent = p.name + ' — ' + IN(issue);
  const ol = $('stepsOl'); ol.replaceChildren();
  [tx('افتح تطبيق {p} الرسمي أو موقعه الرسمي فقط.', { p: p.name }), tx('راجع أي إشعار أو بريد رسمي يذكر سبب القرار، واحتفظ بلقطة شاشة.'), tx('ابحث عن خيارات المساعدة أو الاستئناف داخل المنصة نفسها.'), tx('راجع المسودة وعدّل أو احذف أي جزء لا ينطبق على حالتك.'), tx('قدّم الطلب بنفسك عبر القناة الرسمية. لا ترسل كلمات مرور أو رموز تحقق.'), tx('احتفظ بنسخة من المراسلات؛ مدة الرد وقرار المنصة يحددهما الطرف الرسمي فقط.')]
    .forEach((st, i) => ol.appendChild(h('li', {}, h('span', { cls: 'step-num', text: String(i + 1) }), h('span', { text: st }))));
  const L = $('resLinks'); L.replaceChildren(); L.appendChild(helpBlock(p));
  renderPred();
}
function showResult() {
  resultText();
  buildStars(); checkSens(); $('btnMail').style.display = MAIL[sel] ? '' : 'none'; setStage(3);
}
/* ---------- appeal guidance (dated, source-reviewed; how = {ar, en, fr}) ---------- */
const APPEAL = {
  whatsapp: { url: 'https://whatsapp.com/faq/en/general/23154266', checked: '2026-11-06', how: {
    ar: 'عند ظهور شاشة حظر الرقم داخل التطبيق اضغط «Request a review». يُراجَع رقم هاتف واحد فقط في كل طلب، وتقديم أكثر من طلب لا يسرّع المراجعة.',
    en: 'When the number-banned screen appears in the app, tap “Request a review”. Only one phone number is reviewed per request, and submitting more than one request does not speed up the review.',
    fr: 'Lorsque l’écran de blocage du numéro s’affiche dans l’application, appuyez sur « Request a review ». Un seul numéro de téléphone est examiné par demande, et envoyer plusieurs demandes n’accélère pas l’examen.' } },
  twitter: { url: 'https://help.x.com/managing-your-account/suspended-x-accounts', checked: '2026-11-06', how: {
    ar: 'تشرح صفحة X الرسمية للحسابات المعلّقة طريقة الاستئناف: سجّل الدخول إلى الحساب المعلّق وقدّم طلب استئناف واحدًا واضحًا من صفحة المساعدة.',
    en: 'X’s official page on suspended accounts explains how to appeal: log in to the suspended account and submit one clear appeal request from the help page.',
    fr: 'La page officielle de X sur les comptes suspendus explique comment faire appel : connectez-vous au compte suspendu et envoyez une seule demande d’appel claire depuis la page d’aide.' } },
  youtube: { url: 'https://support.google.com/youtube/answer/2802168', checked: '2026-11-06', how: {
    ar: 'ابدأ الاستئناف من YouTube Studio عبر إشعار إنهاء القناة. تتيح YouTube تقديمه خلال سنة من تاريخ الإنهاء، وهناك حد لعدد المحاولات.',
    en: 'Start the appeal from YouTube Studio through the channel termination notice. YouTube allows submitting it within one year of the termination date, and the number of attempts is limited.',
    fr: 'Lancez l’appel depuis YouTube Studio via la notification de résiliation de la chaîne. YouTube permet de le déposer dans un délai d’un an à compter de la résiliation, et le nombre de tentatives est limité.' } },
  tiktok: { checked: '2026-11-06', how: {
    ar: 'افتح إشعار القرار داخل التطبيق واضغط «Appeal» واتبع الخطوات. لمراجعة حالة الحساب: الملف الشخصي ← القائمة ← الإعدادات والخصوصية ← الدعم ← مركز الأمان.',
    en: 'Open the decision notice inside the app, tap “Appeal” and follow the steps. To check the account status: Profile → Menu → Settings and privacy → Support → Safety Center.',
    fr: 'Ouvrez la notification de la décision dans l’application, appuyez sur « Appeal » et suivez les étapes. Pour vérifier l’état du compte : Profil → Menu → Paramètres et confidentialité → Assistance → Centre de sécurité.' } },
  instagram: { checked: '2026-11-06', how: {
    ar: 'سجّل الدخول بالحساب المعطّل واختر خيار طلب المراجعة (Request Review) على شاشة التعطيل. قد لا تتوفر نماذج استئناف خارجية، لذا ابدأ من داخل التطبيق.',
    en: 'Log in with the disabled account and choose the Request Review option on the disabled-account screen. External appeal forms may not be available, so start from inside the app.',
    fr: 'Connectez-vous avec le compte désactivé et choisissez l’option Request Review sur l’écran de désactivation. Des formulaires d’appel externes peuvent ne pas être disponibles ; commencez donc depuis l’application.' } },
  facebook: { checked: '2026-11-06', how: {
    ar: 'استخدم رابط الاستئناف أو الخيار الظاهر في إشعار التعطيل (البريد أو شاشة تسجيل الدخول). يذكر مركز مساعدة فيسبوك مهلة استئناف محدودة (نحو 180 يومًا)، فتحقق من إشعارك.',
    en: 'Use the appeal link or option shown in the disabled-account notice (email or login screen). Facebook’s Help Center mentions a limited appeal window (about 180 days), so check your notice.',
    fr: 'Utilisez le lien ou l’option d’appel indiqué dans la notification de désactivation (e-mail ou écran de connexion). Le Centre d’aide de Facebook mentionne un délai d’appel limité (environ 180 jours) ; vérifiez donc votre notification.' } }
};
const STALE_DAYS = 90;
function dayAge(d) { return Math.floor((Date.now() - new Date(d + 'T00:00:00').getTime()) / 864e5); }
function dayFmt(d) { try { return new Date(d + 'T00:00:00').toLocaleDateString(LOCALE[uiLang], { dateStyle: 'long' }); } catch (e) { return d; } }
function appealBlock(a) {
  const box = h('div', { cls: 'appeal-box' });
  box.appendChild(h('div', { cls: 'ttl', text: tx('طريقة الاستئناف لدى المنصة') }));
  box.appendChild(h('div', { text: a.how[uiLang] || a.how.ar }));
  if (a.url) box.appendChild(h('a', { cls: 'btn btn-outline lnk', style: 'margin-top:8px', href: a.url, target: '_blank', rel: 'noopener noreferrer' }, h('i', { cls: 'fa-solid fa-arrow-up-right-from-square' }), ' ' + tx('فتح الصفحة الرسمية')));
  const stale = dayAge(a.checked) > STALE_DAYS;
  box.appendChild(h('div', { cls: 'note' + (stale ? ' caution' : ''), text: tx('آخر مراجعة لهذه المعلومة: {d}', { d: dayFmt(a.checked) }) + (stale ? ' — ' + tx('مضى أكثر من {n} يومًا، وقد تكون الخطوات تغيّرت فتحقق من المنصة.', { n: STALE_DAYS }) : '.') + ' ' + tx('قد تتطلب الخطوات تسجيل الدخول إلى حسابك، وقد تتغير الروابط دون إشعار.') }));
  box.appendChild(h('a', { cls: 'lnk-u', href: 'https://t.me/r_c_a_16', target: '_blank', rel: 'noopener noreferrer', text: tx('أبلغ عن معلومة أو رابط لم يعد يعمل') }));
  return box;
}
function helpBlock(p) {
  const w = h('div', { cls: 'tip' });
  const ap = APPEAL[p.k]; if (ap) w.appendChild(appealBlock(ap));
  if (p.help) {
    w.appendChild(h('div', { text: tx('مركز المساعدة الرسمي: {u}', { u: p.help.replace('https://', '') }) }));
    w.appendChild(h('a', { cls: 'btn btn-outline lnk', style: 'margin-top:8px', href: p.help, target: '_blank', rel: 'noopener noreferrer' }, h('i', { cls: 'fa-solid fa-arrow-up-right-from-square' }), ' ' + tx('فتح مركز المساعدة')));
    w.appendChild(h('div', { cls: 'note caution', text: tx(p.cand ? 'قد يتغير هذا الرابط أو لا يفتح؛ إن لم يعمل فابحث عن «المساعدة» داخل التطبيق الرسمي، وتأكد أن النطاق يعود للجهة الرسمية قبل تسجيل الدخول.' : 'تأكد أن النطاق يعود للجهة الرسمية قبل تسجيل الدخول، وإن لم يفتح الرابط فابحث عن «المساعدة» داخل التطبيق الرسمي.') }));
  } else w.appendChild(h('div', { text: tx('رابط مركز المساعدة الرسمي غير متوفر حاليًا في التطبيق. ابحث عن «المساعدة» أو «الدعم» داخل التطبيق الرسمي نفسه.') }));
  if (!(ap && ap.url)) w.appendChild(h('div', { cls: 'note', text: tx('لا يوفّر التطبيق رابط استئناف مباشر؛ ابحث عن خيار الاستئناف أو «تقديم طلب» داخل مركز المساعدة.') }));
  return w;
}
$('btnSubmit').addEventListener('click', generate);
$('btnRegen').addEventListener('click', generate);
$('msgEdit').addEventListener('input', () => { dirty = true; checkSens(); });
function checkSens() { $('sensWarn').classList.toggle('show', sensitive($('msgEdit').value)); }

/* ---------- result actions ---------- */
async function copyTxt(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    const ta = h('textarea', { style: 'position:fixed;opacity:0' }); ta.value = t; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (er) {} ta.remove(); return ok;
  }
}
$('btnCopy').addEventListener('click', async () => {
  const t = $('msgEdit').value; if (!t.trim()) return toast('لا توجد رسالة لنسخها');
  if (sensitive(t) && !ask('النص قد يحتوي معلومة حساسة. نسخه رغم ذلك؟')) return;
  toast(await copyTxt(t) ? 'تم نسخ الرسالة' : 'تعذر النسخ، حدّد النص وانسخه يدويًا');
});
function download(name, mime, data) {
  const a = h('a', { href: URL.createObjectURL(new Blob([data], { type: mime })), download: name });
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$('btnTxt').addEventListener('click', () => { const t = $('msgEdit').value; if (!t.trim()) return toast('لا توجد رسالة'); download('unlock-dz-message.txt', 'text/plain;charset=utf-8', t); });
$('btnSave').addEventListener('click', () => {
  const t = $('msgEdit').value.trim();
  if (!t) return toast('الرسالة فارغة');
  if (t.length > LIM.text) return toast(tx('الرسالة أطول من {n} حرف', { n: LIM.text }));
  if (sensitive(t) && !ask('النص قد يحتوي معلومة حساسة. حفظه رغم ذلك؟')) return;
  const now = Date.now(), ex = logRecs.find(r => r.id === curId);
  if (ex) { Object.assign(ex, { text: t, plat: sel, issue, lang: $('langIn').value, uid: $('userInput').value.trim().slice(0, 60), updated: now }); }
  else {
    if (logRecs.length >= LIM.recs) return toast(tx('بلغ السجل الحد الأقصى ({n}). احذف بعض السجلات.', { n: LIM.recs }));
    curId = now.toString(36) + Math.random().toString(36).slice(2, 7);
    logRecs.unshift({ id: curId, plat: sel, issue, status: 'draft', lang: $('langIn').value, text: t, notes: '', uid: $('userInput').value.trim().slice(0, 60), follow: '', created: now, updated: now });
  }
  if (saveLog()) { dirty = false; toast('تم الحفظ في السجل'); }
});
$('btnReset').addEventListener('click', () => {
  if (dirty && !ask('لديك مسودة غير محفوظة. بدء حالة جديدة؟')) return;
  sel = null; issue = null; curId = null; dirty = false; lastGen = ''; $('msgEdit').value = '';
  ['userInput', 'dateIn', 'detIn'].forEach(i => $(i).value = ''); $('claimIn').checked = false; facts.clear(); ocrReset(); detCheck(); onIdInput(); buildPlats(); setStage(1);
});
function buildStars() {
  const s = $('starRating'); s.replaceChildren();
  for (let i = 1; i <= 5; i++) s.appendChild(h('i', { cls: 'fa-solid fa-star' + (i <= rating ? ' active' : ''), onclick: () => { rating = i; save(K.RATING, i); buildStars(); } }));
}

/* ---------- log page ---------- */
function openRec(r) {
  if (dirty && !ask('لديك مسودة غير محفوظة ستُستبدل. المتابعة؟')) return;
  sel = r.plat; issue = r.issue; curId = r.id; lastPlat = sel;
  selectPlat(sel, true); issue = r.issue; facts.clear(); buildIssues(); showDiag();
  $('userInput').value = r.uid || ''; onIdInput(); $('dateIn').value = ''; $('detIn').value = ''; $('claimIn').checked = false; detCheck();
  $('langIn').value = r.lang; $('msgEdit').value = r.text; lastGen = r.text; dirty = false;
  navTo('process'); showResult();
}
function followIcs(r) {
  const esc = t => String(t).replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\r?\n/g, '\\n');
  const d = r.follow.replace(/-/g, ''), z = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UNLOCK DZ//EN', 'BEGIN:VEVENT', 'UID:' + r.id + '@unlock-dz', 'DTSTAMP:' + z, 'DTSTART;VALUE=DATE:' + d,
    'SUMMARY:' + esc(tx('متابعة طلب الاستئناف: {p}', { p: P[r.plat].name })), 'DESCRIPTION:' + esc(tx('افتح التطبيق الرسمي وتحقق من حالة طلبك. لا تُرسل أي طلب جديد قبل ذلك.')), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  download('unlock-dz-followup.ics', 'text/calendar;charset=utf-8', ics);
}
function renderLog() {
  const q = $('logSearch').value.toLowerCase().trim(), f = $('logFilter').value, box = $('logList'); box.replaceChildren();
  const list = logRecs.filter(r => (!f || r.status === f) && (!q || (P[r.plat].name + ' ' + ISS[r.issue].n + ' ' + IN(r.issue) + ' ' + r.text + ' ' + r.notes).toLowerCase().includes(q)));
  if (!list.length) { box.appendChild(h('div', { cls: 'empty', text: tx(logRecs.length ? 'لا توجد نتائج مطابقة.' : 'لا توجد مسودات محفوظة بعد. جهّز رسالة ثم اضغط «حفظ في السجل».') })); return; }
  list.forEach(r => {
    const st = h('select', { 'aria-label': tx('الحالة') }); Object.keys(ST).forEach(k => { const o = h('option', { value: k, text: tx(ST[k]) }); if (k === r.status) o.selected = true; st.appendChild(o); });
    st.addEventListener('change', () => { r.status = st.value; st.closest('.rec').className = 'rec st-' + st.value; r.updated = Date.now(); saveLog(); toast('تم تحديث الحالة'); });
    const fw = h('input', { type: 'date', 'aria-label': tx('تاريخ المتابعة') }); fw.value = r.follow || '';
    fw.addEventListener('change', () => { r.follow = /^\d{4}-\d{2}-\d{2}$/.test(fw.value) ? fw.value : ''; r.updated = Date.now(); if (saveLog()) { toast('تم حفظ تاريخ المتابعة'); renderLog(); } });
    const due = r.follow && r.follow <= todayStr() && (r.status === 'sent' || r.status === 'waiting');
    const nt = h('textarea', { maxlength: String(LIM.notes), placeholder: tx('ملاحظاتك (اختياري)'), dir: 'auto', style: 'min-height:60px' }); nt.value = r.notes;
    nt.addEventListener('change', () => { if (sensitive(nt.value)) { nt.value = r.notes; return toast('الملاحظات قد تحتوي معلومة حساسة (كلمة مرور أو رمز)، لم تُحفظ.'); } r.notes = nt.value.slice(0, LIM.notes); r.updated = Date.now(); if (saveLog()) toast('تم حفظ الملاحظات'); });
    box.appendChild(h('div', { cls: 'rec st-' + r.status }, h('h4', { text: P[r.plat].name + ' — ' + IN(r.issue) }),
      h('div', { cls: 'meta', text: tx('أُنشئ: {c} • آخر تعديل: {u}', { c: fmt(r.created), u: fmt(r.updated) }) }),
      h('div', { cls: 'pv', dir: 'auto', text: r.text }), h('div', { cls: 'fld' }, st), h('div', { cls: 'fld' }, h('label', { text: tx('تاريخ المتابعة (اختياري)') }), fw),
      due ? h('div', { cls: 'meta', style: 'color:var(--amber);font-weight:700', text: tx('حان موعد المتابعة') }) : null, h('div', { cls: 'fld' }, nt),
      h('div', { cls: 'row' }, h('button', { cls: 'btn btn-primary', type: 'button', text: tx('فتح وتعديل'), onclick: () => openRec(r) }),
        r.follow ? h('button', { cls: 'btn btn-outline', type: 'button', text: tx('إضافة للتقويم'), onclick: () => followIcs(r) }) : null,
        h('button', { cls: 'btn btn-danger', type: 'button', text: tx('حذف'), onclick: () => { if (!ask('حذف هذا السجل نهائيًا؟')) return; logRecs = logRecs.filter(x => x !== r); if (r.id === curId) curId = null; saveLog(); renderLog(); toast('تم الحذف'); } }))));
  });
}
const fo = $('logFilter');
function buildLogFilter() { const v = fo.value; fo.replaceChildren(); fo.appendChild(h('option', { value: '', text: tx('كل الحالات') })); Object.keys(ST).forEach(k => fo.appendChild(h('option', { value: k, text: tx(ST[k]) }))); fo.value = v; }
buildLogFilter();
$('logSearch').addEventListener('input', renderLog); fo.addEventListener('change', renderLog);
$('btnClearLog').addEventListener('click', () => { if (!logRecs.length) return toast('السجل فارغ'); if (!ask('مسح كل السجل نهائيًا؟ لا يمكن التراجع.')) return; logRecs = []; curId = null; saveLog(); renderLog(); toast('تم مسح السجل'); });
$('btnExp').addEventListener('click', () => { if (!logRecs.length) return toast('لا يوجد ما يُصدَّر'); download('unlock-dz-log.json', 'application/json', JSON.stringify({ app: 'unlock-dz', v: 1, exported: Date.now(), records: logRecs }, null, 1)); });
$('btnImp').addEventListener('click', () => $('impFile').click());
$('impFile').addEventListener('change', e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  if (f.size > LIM.imp) return toast('الملف كبير جدًا');
  const fr = new FileReader();
  fr.onerror = () => toast('تعذرت قراءة الملف');
  fr.onload = () => {
    let d; try { d = JSON.parse(fr.result); } catch (er) { return toast('ملف غير صالح'); }
    if (!d || d.app !== 'unlock-dz' || !Array.isArray(d.records)) return toast('ملف غير صالح: البنية غير مطابقة');
    const ok = d.records.slice(0, LIM.recs).map(cleanRec).filter(Boolean);
    if (!ok.length) return toast('لا توجد سجلات صالحة في الملف');
    if (!ask(tx('استيراد {n} سجل ودمجها مع الحالي؟', { n: ok.length }))) return;
    ok.forEach(r => { const i = logRecs.findIndex(x => x.id === r.id); if (i > -1) { if (r.updated > logRecs[i].updated) logRecs[i] = r; } else logRecs.push(r); });
    logRecs.sort((a, b) => b.updated - a.updated); logRecs = logRecs.slice(0, LIM.recs);
    if (saveLog()) { renderLog(); toast(tx('تم استيراد {n} سجل', { n: ok.length })); }
  };
  fr.readAsText(f);
});

/* ---------- scam checker (local keyword rules, no network) ---------- */
const SCAM_RULES = [
  { w: 3, t: 'يعد بـ«ضمان» فك الحظر أو الاسترداد', re: /ضمان|مضمون|100\s*%|guarant|garanti/i },
  { w: 3, t: 'يطلب دفعًا أو تحويل رصيد أو عملات رقمية', re: /ادفع|دفع|تحويل|حوّل|رصيد|فليكسي|flexy|baridimob|بريدي\s*موب|ccp|ريتشارج|recharge|paypal|usdt|bitcoin|crypto|binance|western\s*union|gift\s*card|payer|paiement|virement|versement|pay\s*(?:me|first)|\d+\s*(?:دج|da|dzd|\$|€|usd|eur)|دولار/i },
  { w: 3, t: 'يذكر كلمة المرور أو رمز التحقق (لا يحق لأحد طلبهما)', re: /كلمة\s*(?:ال)?(?:مرور|سر)|باسورد|password|mot\s*de\s*passe|رمز\s*(?:التحقق|الأمان|الاسترداد)|كود\s*(?:التحقق|التفعيل)|otp|verification\s*code|code\s*de\s*v[ée]rification|2fa|backup\s*code/i },
  { w: 3, t: 'يطلب تسليمه الحساب أو تحكمًا عن بعد', re: /تحكم\s*عن\s*بعد|anydesk|teamviewer|(?:سلّ?م|اعطني|أعطني)\s*(?:لي\s*)?(?:الحساب|حسابك)|(?:give|send)\s*me\s*(?:access|your\s*account|login)|acc[èe]s\s*[àa]\s*distance|(?:donnez|envoyez)-?moi\s*(?:l.acc[èe]s|votre\s*compte)/i },
  { w: 2, t: 'يدّعي علاقة أو واسطة داخل المنصة', re: /موظف\s*(?:في|ب|عند)|واسطة|من\s*الداخل|علاقات?\s*داخل|insider|inside\s*(?:contact|source|team)|employee\s*(?:at|of|in)|contact\s*interne|source\s*interne|employ[ée]\s*(?:chez|de)/i },
  { w: 2, t: 'يضغط عليك بالاستعجال أو بعرض محدود', re: /فورا|فورًا|آخر\s*فرصة|عرض\s*محدود|خلال\s*\d+\s*(?:ساعة|ساعات)|urgent|immediately|last\s*chance|limited\s*(?:time|offer)|within\s*\d+\s*hours?|derni[èe]re\s*chance|imm[ée]diatement|sous\s*\d+\s*heures?/i },
  { w: 2, t: 'يعدك بطريقة سرية أو ثغرة', re: /ثغرة|طريقة\s*(?:خاصة|سرية)|secret\s*method|loophole|exploit|m[ée]thode\s*secr[èe]te|faille/i },
  { w: 2, t: 'يطلب صورة هويتك أو وثائقك خارج المنصة', re: /صورة\s*(?:الهوية|البطاقة|جواز)|بطاقة\s*(?:التعريف|الهوية)|passport|id\s*card|carte\s*d.identit[ée]|pi[èe]ce\s*d.identit[ée]/i }
];
const SHORTENERS = ['bit.ly', 'tinyurl.com', 'cutt.ly', 'is.gd', 'rb.gy', 'shorturl.at'], CHANNELS = ['t.me', 'wa.me', 'telegram.me'];
const OFFICIAL_BASE = ['whatsapp.com', 'facebook.com', 'instagram.com', 'meta.com', 'tiktok.com', 'x.com', 'twitter.com', 'youtube.com', 'google.com', 'telegram.org'];
function baseHost(x) { return x.split('.').slice(-2).join('.'); }
const OFFICIAL = new Set(OFFICIAL_BASE.concat(Object.values(P).map(p => { try { return p.help ? baseHost(new URL(p.help).hostname) : ''; } catch (e) { return ''; } }).filter(Boolean)));
function scamLinks(txt) {
  const out = [], seen = new Set();
  (txt.match(/(?:https?:\/\/|www\.)[^\s<>"]+|\b(?:bit\.ly|tinyurl\.com|cutt\.ly|is\.gd|rb\.gy|shorturl\.at|t\.me|wa\.me|telegram\.me)\/[^\s<>"]*/gi) || []).forEach(u => {
    let host = ''; try { host = new URL(/^https?:/i.test(u) ? u : 'https://' + u).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) { return; }
    if (host && !seen.has(host)) { seen.add(host); out.push(host); }
  });
  return out;
}
function runScam() {
  const txt = $('scamIn').value.trim(), out = $('scamOut'); out.replaceChildren();
  if (!txt) return toast('الصق نص العرض أولًا');
  const hits = SCAM_RULES.filter(r => r.re.test(txt)).map(r => ({ w: r.w, t: tx(r.t) }));
  scamLinks(txt).forEach(host => {
    if (SHORTENERS.includes(host)) hits.push({ w: 2, t: tx('رابط مختصر يخفي الوجهة الحقيقية') });
    else if (CHANNELS.includes(host)) hits.push({ w: 1, t: tx('يوجّهك للتواصل خارج المنصة (تلجرام أو واتساب)') });
    else if (!OFFICIAL.has(baseHost(host))) hits.push({ w: 2, t: tx('رابط لا يعود لنطاق رسمي معروف: {d}', { d: host }) });
  });
  hits.sort((a, b) => b.w - a.w);
  const sum = hits.reduce((a, x) => a + x.w, 0), max = hits.reduce((a, x) => Math.max(a, x.w), 0);
  const lvl = max >= 3 || sum >= 5 ? 3 : sum >= 2 ? 2 : sum === 1 ? 1 : 0;
  const msg = ['لم تُكتشف علامات واضحة. هذا لا يعني أن العرض آمن؛ لا تدفع لأحد خارج المنصة ولا تشارك بياناتك.', 'علامات قليلة: لم تظهر علامات قوية، لكن تحقق من المصدر قبل أي خطوة.', 'مشبوه: تتوفر علامات تستدعي الحذر. تحقق عبر القناة الرسمية فقط.', 'خطر مرتفع: تتوفر علامات احتيال واضحة. لا تدفع ولا ترسل أي بيانات.'][lvl];
  out.appendChild(h('div', { cls: 'help-item ' + (lvl === 3 ? 'danger' : lvl === 2 ? 'caution' : ''), style: 'margin-top:12px' }, h('h4', { text: tx(msg) })));
  if (hits.length) {
    out.appendChild(h('p', { cls: 'note', style: 'font-weight:700;margin-top:10px', text: tx('ما الذي رصدناه') }));
    hits.forEach(x => out.appendChild(h('div', { cls: 'help-item ' + (x.w === 3 ? 'danger' : x.w === 2 ? 'caution' : '') }, h('p', { text: x.t }))));
  }
  out.appendChild(h('div', { cls: 'tip', text: tx('لا تدفع ولا ترسل كلمة مرور أو رمزًا أو وثائق لأي وسيط. الاستئناف الرسمي يتم عبر المنصة نفسها.') }));
}
$('scamBtn').addEventListener('click', runScam);

/* ---------- help page ---------- */
const hs = $('helpSel');
Object.values(P).forEach(p => hs.appendChild(h('option', { value: p.k, text: p.name })));
function renderHelp() { const p = P[hs.value], b = $('helpInfo'); b.replaceChildren(helpBlock(p), h('div', { cls: 'tip', text: tx('تنبيه: الإرشادات هنا عامة وليست قرارًا من المنصة. ما يحدد حالتك هو إشعار المنصة الرسمي فقط.') })); }
hs.addEventListener('change', renderHelp); renderHelp();

/* ---------- settings / home ---------- */
$('btnClearAll').addEventListener('click', () => {
  if (!ask('مسح كل البيانات المحلية (المفضلة، آخر منصة، التقييم، السجل)؟ لا يمكن التراجع.')) return;
  try { Object.values(K).forEach(k => localStorage.removeItem(k)); } catch (e) { toast('تعذر المسح'); }
  fav.length = 0; lastPlat = null; rating = 0; logRecs = []; curId = null; applyTheme(systemTheme()); ipReset(); setLang('ar', false); toast('تم مسح البيانات المحلية');
});
function renderHome() {
  const b = $('btnLast');
  if (lastPlat && P[lastPlat]) { b.style.display = ''; b.textContent = tx('متابعة مع {p}', { p: P[lastPlat].name }); } else b.style.display = 'none';
}
$('btnStart').addEventListener('click', () => { navTo('process'); });
$('btnLast').addEventListener('click', () => { navTo('process'); selectPlat(lastPlat, true); });

/* ---------- mailto ---------- */
// أضف هنا عناوين الدعم الرسمية الموثّقة فقط (من صفحة المساعدة الرسمية للمنصة)، مثال: freefire: 'support@example.com'
const MAIL = {};
const MAILTO_MAX = 1900; // بعض التطبيقات تقطع الروابط الأطول

$('btnMail').addEventListener('click', async () => {
  const to = MAIL[sel];
  if (!to) return toast('لا يوجد بريد دعم موثّق لهذه المنصة');
  const body = $('msgEdit').value.trim();
  if (!body) return toast('الرسالة فارغة');
  if (sensitive(body) && !ask('النص قد يحتوي معلومة حساسة. فتح البريد رغم ذلك؟')) return;
  const subject = 'Appeal for Restoring My Account: ' + $('userInput').value.trim();
  const enc = s => encodeURIComponent(s.replace(/\r?\n/g, '\r\n'));
  let url = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + enc(body);
  if (url.length > MAILTO_MAX) {
    const ok = await copyTxt(body);
    url = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + enc('(Paste the appeal message here)');
    toast(ok ? 'الرسالة طويلة: نُسخت، الصقها داخل البريد' : 'الرسالة طويلة: انسخها يدويًا والصقها داخل البريد');
  }
  const a = h('a', { href: url }); document.body.appendChild(a); a.click(); a.remove();
});

/* ---------- OCR (Tesseract.js, lazy-loaded, client-side) ---------- */
const TESS_SRC = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
const OCR_MAX = 8 * 1024 * 1024;
let tessPromise = null;
function loadTess() {
  if (window.Tesseract) return Promise.resolve();
  if (!tessPromise) tessPromise = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = TESS_SRC; s.async = true;
    s.onload = res; s.onerror = () => { tessPromise = null; rej(new Error('load')); };
    document.head.appendChild(s);
  });
  return tessPromise;
}
// لا نستخدم \b مع العربية.
const OCR_RULES = [
  { issue: 'banned',   re: /permanently (?:banned|suspended)|banned|\bban\b|محظور|حظر|banni|bannissement/ig },
  { issue: 'disabled', re: /suspended|disabled|deactivated|تعطيل|معطل|موقوف|suspendu|désactivé/ig },
  { issue: 'login',    re: /locked|incorrect password|verification code|try again later|can'?t log ?in|مقفل|رمز التحقق|verrouillé/ig },
  { issue: 'banned',   re: /violation|violat|community guidelines|terms of service|24 hours|48 hours|مخالفة|24 ساعة|24 heures/ig }
];
function ocrAnalyze(text) {
  const found = {};
  OCR_RULES.forEach(r => {
    const m = text.match(r.re);
    if (!m) return;
    if (!found[r.issue]) found[r.issue] = new Set();
    m.forEach(x => found[r.issue].add(x.toLowerCase()));
  });
  const best = ['banned', 'disabled', 'login'].filter(k => found[k]).sort((a, b) => found[b].size - found[a].size)[0];
  if (!best) return null;
  let key = best;
  const allowed = issuesOf(P[sel]);
  if (P[sel].cat === 'game' && (key === 'banned' || key === 'disabled')) key = 'ingame';
  if (!allowed.includes(key)) key = allowed.find(k => DECISION.includes(k)) || allowed[0];
  const kws = Array.from(new Set([].concat(...Object.values(found).map(s => Array.from(s))))).slice(0, 6);
  return { issue: key, kws };
}
function ocrReset() {
  $('ocrRes').style.display = 'none'; $('ocrRes').replaceChildren();
  $('ocrStatus').textContent = ''; $('ocrProg').hidden = true; $('ocrBar').style.width = '0';
}
$('btnOcr').addEventListener('click', () => { if (!sel) return toast('اختر منصة أولًا'); $('ocrFile').click(); });
$('ocrFile').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  ocrReset();
  const st = $('ocrStatus'), btn = $('btnOcr');
  if (!/^image\//.test(f.type)) { st.textContent = tx('الملف المختار ليس صورة.'); return; }
  if (f.size > OCR_MAX) { st.textContent = tx('الصورة كبيرة جدًا (الحد 8 ميغابايت).'); return; }
  btn.disabled = true; $('ocrProg').hidden = false;
  try {
    st.textContent = tx('جارٍ تحميل أداة القراءة (أول مرة فقط)...');
    await loadTess();
    const r = await window.Tesseract.recognize(f, uiLang === 'fr' ? 'eng+fra+ara' : 'eng+ara', {
      logger: m => {
        if (m.status === 'recognizing text') { st.textContent = tx('جارٍ قراءة النص...'); $('ocrBar').style.width = Math.round(m.progress * 100) + '%'; }
        else if (m.status && m.status.indexOf('loading') === 0) st.textContent = tx('جارٍ تحميل بيانات اللغة...');
      }
    });
    const text = (r.data.text || '').trim();
    if (text.length < 8 || r.data.confidence < 40) { st.textContent = tx('الصورة غير واضحة. جرّب لقطة أوضح أو أكبر وبدون انعكاس، أو اختر نوع المشكلة يدويًا.'); return; }
    const res = ocrAnalyze(text);
    if (!res) { st.textContent = tx('قُرئ النص لكن لم أجد كلمات حظر معروفة. اختر نوع المشكلة يدويًا.'); return; }
    st.textContent = tx(sensitive(text) ? 'تنبيه: يبدو أن الصورة تتضمن معلومة حساسة، لا تشاركها مع أحد.' : 'تمت القراءة.');
    const box = $('ocrRes'); box.style.display = '';
    const kw = h('div', {}, h('span', { text: tx('كلمات مكتشفة:') + ' ' }), ...res.kws.map(k => h('span', { cls: 'kw', text: k })));
    const apply = h('button', { cls: 'btn btn-primary', type: 'button', text: tx('تطبيق الاقتراح: {n}', { n: IN(res.issue) }) });
    apply.addEventListener('click', () => { issue = res.issue; buildIssues(); showDiag(); $('noTpl').classList.remove('show'); toast('تم اختيار نوع المشكلة'); });
    box.appendChild(h('div', { cls: 'tip' }, h('div', { text: tx('نوع المشكلة المقترح: {n} (اقتراح تقريبي، راجعه قبل المتابعة)', { n: IN(res.issue) }) }), kw, apply));
  } catch (err) {
    st.textContent = tx('تعذر تشغيل القراءة. تحقق من الاتصال بالإنترنت (لتحميل الأداة أول مرة) أو اختر النوع يدويًا.');
  } finally { btn.disabled = false; $('ocrProg').hidden = true; }
});

/* ---------- IP Ban Appeal (local templates, no network) ---------- */
const IPISS = ['ipban', 'netr', 'denied', 'susp', 'notsure'];
const IPLG = ['ar', 'en', 'fr'];
const IPU = {
  entry: ['IP Ban Appeal — استئناف تقييد IP', 'IP Ban Appeal — IP Restriction Recovery', 'IP Ban Appeal — Restriction IP'],
  title: ['IP Ban Appeal', 'IP Ban Appeal', 'IP Ban Appeal'],
  sub: ['استعادة الوصول عند تقييد IP أو الشبكة', 'IP Restriction Recovery', 'Récupération après restriction IP'],
  cat: ['الشبكة', 'Network', 'Réseau'],
  back: ['رجوع', 'Back', 'Retour'],
  s1: ['المنصة', 'Platform', 'Plateforme'], s2: ['التفاصيل', 'Details', 'Détails'], s3: ['الرسالة', 'Message', 'Message'],
  pick: ['اختر المنصة', 'Choose the platform', 'Choisissez la plateforme'],
  other: ['أخرى (Other)', 'Other', 'Autre'],
  pname: ['اسم المنصة', 'Platform name', 'Nom de la plateforme'],
  pnamePh: ['مثال: اسم الموقع أو التطبيق', 'e.g. the website or app name', 'ex. nom du site ou de l’application'],
  issue: ['نوع المشكلة', 'Issue type', 'Type de problème'],
  i_ipban: ['IP Ban (حظر IP)', 'IP Ban', 'IP Ban (blocage IP)'],
  i_netr: ['Network Restriction (تقييد الشبكة)', 'Network Restriction', 'Network Restriction (restriction réseau)'],
  i_denied: ['Access Denied (رفض الوصول)', 'Access Denied', 'Access Denied (accès refusé)'],
  i_susp: ['Suspicious Network Activity (نشاط شبكة مشبوه)', 'Suspicious Network Activity', 'Suspicious Network Activity (activité réseau suspecte)'],
  i_notsure: ['Not Sure (لست متأكدًا)', 'Not Sure', 'Not Sure (je ne sais pas)'],
  err: ['رسالة الخطأ التي ظهرت لك (اختياري)', 'Error message you saw (optional)', 'Message d’erreur affiché (facultatif)'],
  errPh: ['اكتب أو الصق نص الرسالة كما ظهرت', 'Type or paste the message exactly as shown', 'Saisissez ou collez le message tel qu’affiché'],
  date: ['متى بدأت المشكلة؟ (اختياري)', 'When did the problem start? (optional)', 'Quand le problème a-t-il commencé ? (facultatif)'],
  net: ['هل تستطيع الدخول إلى حسابك من شبكة أخرى؟ (اختياري)', 'Can you access your account from another network? (optional)', 'Pouvez-vous accéder à votre compte depuis un autre réseau ? (facultatif)'],
  netU: ['لم أجرّب / لست متأكدًا', 'Not tried / not sure', 'Pas essayé / pas sûr'],
  netY: ['نعم، أستطيع', 'Yes, I can', 'Oui, je peux'],
  netN: ['لا، لا أستطيع', 'No, I cannot', 'Non, je ne peux pas'],
  desc: ['وصف إضافي (اختياري)', 'Additional description (optional)', 'Description supplémentaire (facultatif)'],
  descPh: ['اكتب فقط ما تعرفه فعلًا عن المشكلة', 'Write only what you actually know about the problem', 'N’écrivez que ce que vous savez réellement du problème'],
  lang: ['لغة رسالة الاستئناف', 'Appeal message language', 'Langue du message d’appel'],
  safe: ['لا تُدخل كلمة مرور أو رمز تحقق أو أي معلومة حساسة في أي حقل.', 'Never enter a password, verification code or any sensitive information in any field.', 'Ne saisissez jamais de mot de passe, de code de vérification ni d’information sensible dans un champ.'],
  sens: ['يبدو أن أحد الحقول يتضمن معلومة حساسة (كلمة مرور أو رمز أو رقم بطاقة). احذفها قبل المتابعة.', 'A field seems to contain sensitive information (a password, code or card number). Remove it before continuing.', 'Un champ semble contenir une information sensible (mot de passe, code ou numéro de carte). Supprimez-la avant de continuer.'],
  gen: ['إنشاء رسالة الاستئناف', 'Generate appeal message', 'Générer le message d’appel'],
  needIssue: ['اختر نوع المشكلة أولًا.', 'Choose the issue type first.', 'Choisissez d’abord le type de problème.'],
  needName: ['أدخل اسم المنصة (2-60 حرفًا).', 'Enter the platform name (2–60 characters).', 'Saisissez le nom de la plateforme (2 à 60 caractères).'],
  future: ['تاريخ بدء المشكلة لا يمكن أن يكون في المستقبل.', 'The start date cannot be in the future.', 'La date de début ne peut pas être dans le futur.'],
  subjL: ['عنوان الرسالة', 'Message subject', 'Objet du message'],
  copy: ['Copy Message — نسخ الرسالة', 'Copy Message', 'Copy Message — copier le message'],
  copySub: ['نسخ العنوان', 'Copy subject', 'Copier l’objet'],
  copied: ['تم نسخ الرسالة', 'Message copied', 'Message copié'],
  copiedSub: ['تم نسخ العنوان', 'Subject copied', 'Objet copié'],
  copyFail: ['تعذر النسخ، حدّد النص وانسخه يدويًا', 'Could not copy; select the text and copy it manually', 'Copie impossible ; sélectionnez le texte et copiez-le manuellement'],
  edit: ['Edit Message — تعديل الرسالة', 'Edit Message', 'Edit Message — modifier le message'],
  editOn: ['إنهاء التعديل', 'Done editing', 'Terminer la modification'],
  regen: ['Regenerate Message — إعادة الإنشاء', 'Regenerate Message', 'Regenerate Message — régénérer'],
  regenAsk: ['عدّلت الرسالة يدويًا. إعادة الإنشاء ستستبدل تعديلاتك. المتابعة؟', 'You edited the message manually. Regenerating will replace your changes. Continue?', 'Vous avez modifié le message manuellement. La régénération remplacera vos modifications. Continuer ?'],
  sup: ['Official Support — الدعم الرسمي', 'Official Support', 'Official Support — assistance officielle'],
  supNote: ['هذا الرابط هو مركز الدعم الرسمي العام للمنصة، وليس بالضرورة نموذجًا مخصصًا لحظر IP. ابحث داخله عن خيار التواصل أو تقديم طلب.', 'This link is the platform’s general official help center, not necessarily a form dedicated to IP restrictions. Look inside it for a contact or “submit a request” option.', 'Ce lien mène au centre d’aide officiel général de la plateforme, pas nécessairement à un formulaire dédié aux restrictions IP. Cherchez-y une option de contact ou d’envoi de demande.'],
  supNone: ['لا يوجد رابط دعم رسمي محدد لهذه المنصة. ابحث عن «المساعدة» أو «الدعم» داخل موقعها أو تطبيقها الرسمي.', 'There is no specific official support link for this platform. Look for “Help” or “Support” inside its official website or app.', 'Il n’y a pas de lien d’assistance officiel précis pour cette plateforme. Cherchez « Aide » ou « Assistance » dans son site ou son application officiels.'],
  review: ['راجع الرسالة وعدّلها بما يناسب حالتك، ثم قدّمها بنفسك عبر القناة الرسمية. لم تُرسل تلقائيًا.', 'Review and edit the message to fit your case, then submit it yourself through the official channel. It was not sent automatically.', 'Relisez et adaptez le message à votre cas, puis envoyez-le vous-même via le canal officiel. Il n’a pas été envoyé automatiquement.'],
  note: ['UNLOCK DZ لا يستطيع إزالة حظر IP مباشرة. هذه الأداة تساعدك على إعداد طلب استئناف احترافي وإرساله إلى فريق الدعم الرسمي للمنصة.', 'UNLOCK DZ cannot remove an IP ban directly. This tool helps you prepare a professional appeal request and send it to the platform’s official support team.', 'UNLOCK DZ ne peut pas lever directement un blocage IP. Cet outil vous aide à préparer une demande d’appel professionnelle et à l’envoyer à l’équipe d’assistance officielle de la plateforme.'],
  noGuar: ['لا نضمن نجاح الاستئناف أو إزالة الحظر؛ القرار النهائي بيد المنصة. ورسالة خطأ عامة وحدها لا تثبت وجود حظر IP.', 'We do not guarantee that the appeal will succeed or that any restriction will be lifted; the final decision rests with the platform. A generic error message alone does not prove an IP ban.', 'Nous ne garantissons ni le succès de l’appel ni la levée d’une restriction ; la décision finale appartient à la plateforme. Un message d’erreur générique ne prouve pas à lui seul un blocage IP.']
};
const ipi = () => uiLang === 'en' ? 1 : uiLang === 'fr' ? 2 : 0;
const u = k => IPU[k][ipi()];
const IPP = {
  instagram: { n: 'Instagram', ic: 'fa-brands fa-instagram', c: '#e1306c', url: 'https://help.instagram.com',
    svc: ['الوصول إلى حسابي على Instagram أو استخدام تطبيقه', 'access my Instagram account or use the app', 'accéder à mon compte Instagram ou utiliser l’application'],
    chk: ['أرجو التحقق مما إذا كان أي قيد أمني أو متعلق بالشبكة مطبّقًا على وصولي.', 'Please check whether any security- or network-related restriction is applied to my access.', 'Merci de vérifier si une restriction liée à la sécurité ou au réseau s’applique à mon accès.'] },
  tiktok: { n: 'TikTok', ic: 'fa-brands fa-tiktok', c: '#111111', url: 'https://support.tiktok.com',
    svc: ['استخدام TikTok أو تسجيل الدخول إلى حسابي', 'use TikTok or log in to my account', 'utiliser TikTok ou me connecter à mon compte'],
    chk: ['أرجو التحقق مما إذا كانت شبكتي قد فعّلت قيدًا آليًا للأمان أو الوصول.', 'Please check whether my network triggered an automated safety or access restriction.', 'Merci de vérifier si mon réseau a déclenché une restriction automatique de sécurité ou d’accès.'] },
  facebook: { n: 'Facebook', ic: 'fa-brands fa-facebook-f', c: '#1877f2', url: 'https://www.facebook.com/help',
    svc: ['الوصول إلى Facebook أو تسجيل الدخول إلى حسابي', 'access Facebook or log in to my account', 'accéder à Facebook ou me connecter à mon compte'],
    chk: ['أرجو التحقق مما إذا كان فحص أمني آلي يمنع الوصول من شبكتي.', 'Please review whether an automated security check is blocking access from my network.', 'Merci de vérifier si un contrôle de sécurité automatique bloque l’accès depuis mon réseau.'] },
  discord: { n: 'Discord', ic: 'fa-brands fa-discord', c: '#5865f2', url: 'https://support.discord.com',
    svc: ['الاتصال بـ Discord أو تسجيل الدخول إلى حسابي', 'connect to Discord or log in to my account', 'me connecter à Discord ou accéder à mon compte'],
    chk: ['أرجو التحقق مما إذا كان أي حظر آلي أو على مستوى الشبكة يؤثر على وصولي.', 'Please check whether any automated or network-level block is affecting my access.', 'Merci de vérifier si un blocage automatique ou au niveau du réseau affecte mon accès.'] },
  roblox: { n: 'Roblox', ic: 'fa-brands fa-roblox', c: '#e2231a', url: 'https://en.help.roblox.com',
    svc: ['الوصول إلى Roblox أو الانضمام إلى التجارب من شبكتي', 'access Roblox or join experiences from my network', 'accéder à Roblox ou rejoindre des expériences depuis mon réseau'],
    chk: ['أرجو التحقق مما إذا كان عنوان IP الخاص بي مقيّدًا أو مُعلَّمًا لديكم، وإفادتي بكيفية استعادة الوصول.', 'Please check whether my IP address is restricted or flagged on your side, and let me know how to restore access.', 'Merci de vérifier si mon adresse IP est restreinte ou signalée de votre côté, et de m’indiquer comment rétablir l’accès.'] },
  twitter: { n: 'X (Twitter)', ic: 'fa-brands fa-twitter', c: '#000000', url: 'https://help.x.com/contact-us',
    svc: ['الوصول إلى X (Twitter) أو تسجيل الدخول إلى حسابي', 'access X (Twitter) or log in to my account', 'accéder à X (Twitter) ou me connecter à mon compte'],
    chk: ['أرجو التحقق مما إذا كانت شبكتي مقيّدة بواسطة نظام آلي.', 'Please review whether my network is being limited by an automated system.', 'Merci de vérifier si mon réseau est limité par un système automatique.'] },
  snapchat: { n: 'Snapchat', ic: 'fa-brands fa-snapchat', c: '#f7c600', fg: '#111', url: 'https://help.snapchat.com',
    svc: ['تسجيل الدخول إلى Snapchat أو استخدام التطبيق', 'log in to Snapchat or use the app', 'me connecter à Snapchat ou utiliser l’application'],
    chk: ['أرجو التحقق مما إذا كان اتصال شبكتي أو جهازي يؤثر على وصولي.', 'Please check whether my network or device connection is affecting my access.', 'Merci de vérifier si ma connexion réseau ou mon appareil affecte mon accès.'] },
  telegram: { n: 'Telegram', ic: 'fa-brands fa-telegram', c: '#229ed9', url: 'https://telegram.org/faq',
    svc: ['الاتصال بـ Telegram أو تسجيل الدخول إلى حسابي', 'connect to Telegram or sign in to my account', 'me connecter à Telegram ou accéder à mon compte'],
    chk: ['أرجو إفادتي إن كان أي قيد متعلق بالشبكة مطبّقًا، وما الخطوات المتاحة.', 'Please advise whether any network-related restriction applies and what steps are available.', 'Merci de m’indiquer si une restriction liée au réseau s’applique et quelles démarches sont possibles.'] },
  other: { n: '', ic: 'fa-solid fa-globe', c: '#6d5efc', url: '',
    svc: ['الوصول إلى {n}', 'access {n}', 'accéder à {n}'],
    chk: ['أرجو إفادتي بأي خطوات متاحة لاستعادة الوصول.', 'Please let me know of any available steps to restore access.', 'Merci de m’indiquer les démarches possibles pour rétablir l’accès.'] }
};
const IPT = {
  ar: {
    subj: n => `طلب مراجعة تقييد محتمل على عنوان IP أو الشبكة — ${n}`,
    greet: n => `فريق دعم ${n} المحترم،`,
    intro: [n => `أكتب إليكم بخصوص مشكلة تمنعني من الوصول إلى حسابي على ${n}.`, n => `أتواصل معكم بشأن مشكلة تؤثر على وصولي إلى ${n}.`],
    issue: { ipban: s => `لا أستطيع ${s}. أعتقد أن عنوان IP الخاص بي قد يكون مقيّدًا، لكنني لست متأكدًا من السبب.`, netr: s => `لا أستطيع ${s}. يبدو أن اتصال الشبكة الخاص بي قد يكون مقيّدًا.`, denied: s => `لا أستطيع ${s} لأنه تظهر لي رسالة تفيد برفض الوصول.`, susp: s => `لا أستطيع ${s}. أعتقد أن شبكتي ربما صُنّفت على أنها ذات نشاط مشبوه، لكنني لست متأكدًا.`, notsure: s => `لا أستطيع ${s} ولست متأكدًا من السبب، وقد يكون مرتبطًا بشبكتي أو بعنوان IP الخاص بي.` },
    err: e => `الرسالة التي تظهر لي هي: "${e}"`, date: d => `بدأت المشكلة بتاريخ ${d}.`,
    netyes: 'أستطيع الدخول إلى حسابي من شبكة أخرى، مما يشير إلى أن المشكلة قد تكون مرتبطة بشبكتي الحالية.', netno: 'لم أستطع الدخول إلى حسابي من شبكة أخرى أيضًا.',
    desc: d => `تفاصيل إضافية: ${d}`,
    ask: ['هل يمكنكم مراجعة سبب هذا التقييد؟', 'أكون ممتنًا لو تفضلتم بالتحقق من سبب تقييد وصولي.'],
    ask2: 'وإن كان التقييد قد فُرض عن طريق الخطأ، فأرجو استعادة وصولي.', ext: 'يسعدني تزويدكم بأي معلومات إضافية عبر القناة الرسمية.',
    bye: ['شكرًا لوقتكم وتعاونكم.', 'أشكركم مسبقًا على مساعدتكم.'], sign: 'مع خالص التقدير،'
  },
  en: {
    subj: n => `Request to review a possible IP/network access restriction — ${n}`,
    greet: n => `Dear ${n} Support Team,`,
    intro: [n => `I am writing to ask for your help with a problem accessing my ${n} account.`, n => `I am contacting you about a problem that is affecting my access to ${n}.`],
    issue: { ipban: s => `I am unable to ${s}. I believe my IP address may be restricted, but I cannot be sure of the cause.`, netr: s => `I am unable to ${s}. It appears that my network connection may be restricted.`, denied: s => `I am unable to ${s} because I am being shown an "access denied" response.`, susp: s => `I am unable to ${s}. I believe my network may have been flagged for suspicious activity, although I am not certain.`, notsure: s => `I am unable to ${s} and I am not sure why. It may be related to my network or IP address.` },
    err: e => `The message shown to me is: "${e}"`, date: d => `The problem started on ${d}.`,
    netyes: 'I can access my account from a different network, which suggests the issue may be related to my current network.', netno: 'I was not able to access my account from another network either.',
    desc: d => `Additional details: ${d}`,
    ask: ['Could you please review the reason for this restriction?', 'I would appreciate it if you could look into why my access is being limited.'],
    ask2: 'If the restriction was applied in error, I kindly ask you to restore my access.', ext: 'I am happy to provide any additional information through the official channel.',
    bye: ['Thank you for your time and assistance.', 'Thank you in advance for your help.'], sign: 'Kind regards,'
  },
  fr: {
    subj: n => `Demande de vérification d’une éventuelle restriction d’adresse IP ou de réseau — ${n}`,
    greet: n => `Chère équipe d’assistance ${n},`,
    intro: [n => `Je vous écris au sujet d’un problème qui m’empêche d’accéder à mon compte ${n}.`, n => `Je vous contacte au sujet d’un problème qui affecte mon accès à ${n}.`],
    issue: { ipban: s => `Je ne parviens pas à ${s}. Je pense que mon adresse IP est peut-être restreinte, mais je ne peux pas en être certain(e).`, netr: s => `Je ne parviens pas à ${s}. Il semble que ma connexion réseau soit restreinte.`, denied: s => `Je ne parviens pas à ${s}, car un message d’accès refusé s’affiche.`, susp: s => `Je ne parviens pas à ${s}. Je pense que mon réseau a peut-être été signalé pour activité suspecte, sans en être certain(e).`, notsure: s => `Je ne parviens pas à ${s} et j’ignore pourquoi. Cela pourrait être lié à mon réseau ou à mon adresse IP.` },
    err: e => `Le message affiché est : « ${e} »`, date: d => `Le problème a commencé le ${d}.`,
    netyes: 'Je peux accéder à mon compte depuis un autre réseau, ce qui laisse penser que le problème pourrait venir de mon réseau actuel.', netno: 'Je n’ai pas non plus pu accéder à mon compte depuis un autre réseau.',
    desc: d => `Précisions : ${d}`,
    ask: ['Pourriez-vous examiner le motif de cette restriction ?', 'Je vous serais reconnaissant(e) de vérifier pourquoi mon accès est limité.'],
    ask2: 'Si la restriction a été appliquée par erreur, je vous demande de bien vouloir rétablir mon accès.', ext: 'Je me tiens à votre disposition pour fournir toute information complémentaire via le canal officiel.',
    bye: ['Merci pour votre temps et votre aide.', 'Merci d’avance pour votre aide.'], sign: 'Cordialement,'
  }
};
const ipS = { step: 1, plat: null, issue: null, v: 0, gen: '', subject: '', body: '', editing: false, f: { pname: '', err: '', date: '', net: '', desc: '', lang: 'en' } };
(function ipLoad() {
  const d = load(K.IPB, null); if (!d || typeof d !== 'object') return;
  if (IPP[d.plat]) ipS.plat = d.plat;
  if (IPISS.includes(d.issue)) ipS.issue = d.issue;
  const f = d.f || {};
  if (typeof f.pname === 'string') ipS.f.pname = f.pname.slice(0, 60);
  if (typeof f.err === 'string') ipS.f.err = f.err.slice(0, 800);
  if (typeof f.desc === 'string') ipS.f.desc = f.desc.slice(0, 800);
  if (typeof f.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f.date)) ipS.f.date = f.date;
  if (f.net === 'yes' || f.net === 'no') ipS.f.net = f.net;
  if (IPLG.includes(f.lang)) ipS.f.lang = f.lang;
})();
function ipSave() {
  const f = ipS.f, ok = s => sensitive(s) ? '' : s;
  save(K.IPB, { plat: ipS.plat, issue: ipS.issue, f: { pname: ok(f.pname), err: ok(f.err), date: f.date, net: f.net, desc: ok(f.desc), lang: f.lang } });
}
function ipReset() {
  Object.assign(ipS, { step: 1, plat: null, issue: null, v: 0, gen: '', subject: '', body: '', editing: false, f: { pname: '', err: '', date: '', net: '', desc: '', lang: 'en' } });
}
function ipName() { return ipS.plat === 'other' ? ipS.f.pname.trim() : IPP[ipS.plat].n; }
function ipBuild() {
  const f = ipS.f, L = f.lang, t = IPT[L], li = IPLG.indexOf(L), p = IPP[ipS.plat], n = ipName(), v = ipS.v;
  const svc = p.svc[li].replace('{n}', n);
  const lines = [t.greet(n), '', t.intro[v % 2](n), t.issue[ipS.issue](svc)];
  if (f.err.trim()) lines.push(t.err(f.err.trim()));
  if (f.date) { let d = f.date; try { d = new Date(f.date + 'T00:00:00').toLocaleDateString(LOCALE[L], { dateStyle: 'long' }); } catch (e) {} lines.push(t.date(d)); }
  if (f.net === 'yes') lines.push(t.netyes); else if (f.net === 'no') lines.push(t.netno);
  if (f.desc.trim()) lines.push('', t.desc(f.desc.trim()));
  lines.push('', t.ask[v % 2] + ' ' + p.chk[li], t.ask2, t.ext, '', t.bye[v % 2], '', t.sign);
  ipS.subject = t.subj(n); ipS.body = lines.join('\n'); ipS.gen = ipS.body;
}
function ipGo(n) { ipS.step = n; ipRender(); const m = $('mainScroll'); if (m) m.scrollTop = 0; }
function ipChip(p) { return h('div', { cls: 'plat-icon' }, h('i', { cls: p.ic })); }
function ipHead() {
  const rtl = document.documentElement.getAttribute('dir') === 'rtl';
  const back = h('button', { cls: 'btn-back', type: 'button' }, h('i', { cls: 'fa-solid ' + (rtl ? 'fa-arrow-right' : 'fa-arrow-left') }), ' ' + u('back'));
  back.addEventListener('click', () => { if (ipS.step > 1) ipGo(ipS.step - 1); else navTo('process'); });
  return h('div', {}, back, h('div', { cls: 'card-header' }, h('div', { cls: 'card-icon' }, h('i', { cls: 'fa-solid fa-globe' })), h('div', {}, h('div', { cls: 'card-title', text: u('title') }), h('div', { cls: 'card-subtitle', text: u('sub') }))));
}
function ipSteps() {
  const w = h('div', { cls: 'step-indicator' });
  [1, 2, 3].forEach(i => { if (i > 1) w.appendChild(h('div', { cls: 'si-line' + (ipS.step >= i ? ' done' : '') })); w.appendChild(h('div', { cls: 'si-dot' + (ipS.step === i ? ' active' : ipS.step > i ? ' done' : ''), text: String(i), title: u('s' + i) })); });
  return w;
}
function ipStep1() {
  const g = h('div', { cls: 'platform-row' });
  Object.keys(IPP).forEach(k => {
    const p = IPP[k], nm = k === 'other' ? u('other') : p.n;
    const b = h('div', { cls: 'plat-btn' + (k === ipS.plat ? ' sel' : ''), role: 'button', tabindex: '0', 'aria-label': nm }, ipChip(p), h('div', { cls: 'plat-info' }, h('span', { cls: 'plat-name', text: nm })), h('div', { cls: 'plat-check' }, h('i', { cls: 'fa-solid fa-check' })));
    const go = () => { ipS.plat = k; ipSave(); ipGo(2); };
    b.addEventListener('click', go); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    g.appendChild(b);
  });
  return h('div', {}, h('div', { cls: 'section-label', text: u('pick') }), g);
}
function ipStep2() {
  const f = ipS.f, p = IPP[ipS.plat], w = h('div', {});
  w.appendChild(h('div', { cls: 'section-label', text: ipS.plat === 'other' ? u('other') : p.n }));
  const warn = h('p', { cls: 'warn', role: 'alert' }, h('i', { cls: 'fa-solid fa-triangle-exclamation' }), ' ' + u('sens'));
  const chkSens = () => warn.classList.toggle('show', [f.pname, f.err, f.desc].some(s => sensitive(s)));
  const bind = (el, key) => { el.value = f[key]; el.addEventListener('input', () => { f[key] = el.value; ipSave(); chkSens(); }); return el; };
  if (ipS.plat === 'other') w.appendChild(h('div', { cls: 'fld' }, h('label', { text: u('pname') }), bind(h('input', { type: 'text', maxlength: '60', dir: 'auto', placeholder: u('pnamePh'), autocomplete: 'off' }), 'pname')));
  w.appendChild(h('label', { cls: 'input-label', style: 'margin-top:12px', text: u('issue') }));
  const chips = h('div', { cls: 'reason-grid' });
  IPISS.forEach(k => { const c = h('button', { cls: 'reason-btn' + (k === ipS.issue ? ' sel' : ''), type: 'button', text: u('i_' + k) }); c.addEventListener('click', () => { ipS.issue = k; ipSave(); chips.querySelectorAll('.reason-btn').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); $('ipbErr').classList.remove('show'); }); chips.appendChild(c); });
  w.appendChild(chips);
  w.appendChild(h('div', { cls: 'fld' }, h('label', { text: u('err') }), bind(h('textarea', { maxlength: '800', dir: 'auto', placeholder: u('errPh'), style: 'min-height:80px' }), 'err')));
  w.appendChild(h('div', { cls: 'fld' }, h('label', { text: u('date') }), bind(h('input', { type: 'date', max: todayStr() }), 'date')));
  const ns = h('select', {}); [['', 'netU'], ['yes', 'netY'], ['no', 'netN']].forEach(([v, k]) => { const o = h('option', { value: v, text: u(k) }); if (v === f.net) o.selected = true; ns.appendChild(o); });
  ns.addEventListener('change', () => { f.net = ns.value; ipSave(); });
  w.appendChild(h('div', { cls: 'fld' }, h('label', { text: u('net') }), ns));
  w.appendChild(h('div', { cls: 'fld' }, h('label', { text: u('desc') }), bind(h('textarea', { maxlength: '800', dir: 'auto', placeholder: u('descPh'), style: 'min-height:90px' }), 'desc')));
  const ls = h('select', {}); [['ar', 'العربية'], ['en', 'English'], ['fr', 'Français']].forEach(([v, n]) => { const o = h('option', { value: v, text: n }); if (v === f.lang) o.selected = true; ls.appendChild(o); });
  ls.addEventListener('change', () => { f.lang = ls.value; ipSave(); });
  w.appendChild(h('div', { cls: 'fld' }, h('label', { text: u('lang') }), ls));
  w.appendChild(h('p', { cls: 'note alert' }, h('i', { cls: 'fa-solid fa-triangle-exclamation' }), ' ' + u('safe')));
  w.appendChild(warn); chkSens();
  w.appendChild(h('p', { cls: 'input-err', id: 'ipbErr', role: 'alert' }));
  const gb = h('button', { cls: 'btn btn-primary', type: 'button', style: 'margin-top:12px' }, h('i', { cls: 'fa-solid fa-pen-nib' }), ' ' + u('gen'));
  gb.addEventListener('click', ipGenerate);
  w.appendChild(gb);
  return w;
}
function ipGenerate() {
  const f = ipS.f, er = $('ipbErr'), fail = m => { er.textContent = m; er.classList.add('show'); };
  er.classList.remove('show');
  if (!ipS.issue) return fail(u('needIssue'));
  if (ipS.plat === 'other' && (f.pname.trim().length < 2 || f.pname.trim().length > 60)) return fail(u('needName'));
  if ([f.pname, f.err, f.desc].some(s => sensitive(s))) return fail(u('sens'));
  if (f.date && f.date > todayStr()) return fail(u('future'));
  ipS.v = 0; ipS.editing = false; ipBuild(); ipGo(3);
}
function ipStep3() {
  const p = IPP[ipS.plat], w = h('div', {});
  const sb = h('button', { cls: 'btn-back', type: 'button' }, h('i', { cls: 'fa-solid fa-copy' }), ' ' + u('copySub'));
  sb.addEventListener('click', async () => toast(await copyTxt(ipS.subject) ? u('copiedSub') : u('copyFail')));
  w.appendChild(h('div', { cls: 'section-label', text: u('subjL') }));
  w.appendChild(h('div', { cls: 'msg-preview', id: 'ipbSubj', dir: 'auto', style: 'margin-bottom:6px', text: ipS.subject }));
  w.appendChild(sb);
  const ta = h('textarea', { cls: 'ta big', dir: 'auto', maxlength: '4000', 'aria-label': u('s3') }); ta.value = ipS.body; ta.readOnly = !ipS.editing;
  const warn = h('p', { cls: 'warn', role: 'alert' }, h('i', { cls: 'fa-solid fa-triangle-exclamation' }), ' ' + u('sens'));
  ta.addEventListener('input', () => { ipS.body = ta.value; warn.classList.toggle('show', sensitive(ta.value)); });
  w.appendChild(ta); w.appendChild(warn);
  const A = h('div', { cls: 'btns' });
  const cb = h('button', { cls: 'btn btn-primary', type: 'button' }, h('i', { cls: 'fa-solid fa-copy' }), ' ' + u('copy'));
  cb.addEventListener('click', async () => {
    const t = ipS.body; if (!t.trim()) return;
    if (sensitive(t) && !window.confirm(u('sens'))) return;
    toast(await copyTxt(t) ? u('copied') : u('copyFail'));
  });
  const eb = h('button', { cls: 'btn btn-outline', type: 'button' }, h('i', { cls: 'fa-solid fa-pen' }), ' ' + (ipS.editing ? u('editOn') : u('edit')));
  eb.addEventListener('click', () => { ipS.editing = !ipS.editing; ta.readOnly = !ipS.editing; eb.replaceChildren(h('i', { cls: 'fa-solid fa-pen' }), ' ' + (ipS.editing ? u('editOn') : u('edit'))); if (ipS.editing) ta.focus(); });
  const rb = h('button', { cls: 'btn btn-outline', type: 'button' }, h('i', { cls: 'fa-solid fa-rotate' }), ' ' + u('regen'));
  rb.addEventListener('click', () => {
    if (ipS.body !== ipS.gen && !window.confirm(u('regenAsk'))) return;
    ipS.v++; ipBuild(); ta.value = ipS.body; warn.classList.remove('show'); ipS.editing = false; ta.readOnly = true; eb.replaceChildren(h('i', { cls: 'fa-solid fa-pen' }), ' ' + u('edit'));
    $('ipbSubj').textContent = ipS.subject;
  });
  A.appendChild(cb); A.appendChild(eb); A.appendChild(rb);
  if (p.url) A.appendChild(h('a', { cls: 'btn btn-outline lnk', href: p.url, target: '_blank', rel: 'noopener noreferrer' }, h('i', { cls: 'fa-solid fa-arrow-up-right-from-square' }), ' ' + u('sup')));
  else A.appendChild(h('button', { cls: 'btn btn-outline', type: 'button', disabled: '' }, h('i', { cls: 'fa-solid fa-arrow-up-right-from-square' }), ' ' + u('sup')));
  w.appendChild(A);
  w.appendChild(h('p', { cls: 'note caution', text: p.url ? u('supNote') : u('supNone') }));
  w.appendChild(h('p', { cls: 'note', text: u('review') }));
  return w;
}
function ipRender() {
  const lb = $('netLbl'); if (lb) lb.textContent = u('cat');
  const row = $('rowNet');
  if (row) {
    const e = h('div', { cls: 'plat-btn', role: 'button', tabindex: '0', 'aria-label': u('title') }, h('div', { cls: 'plat-icon' }, h('i', { cls: 'fa-solid fa-network-wired' })), h('div', { cls: 'plat-info' }, h('span', { cls: 'plat-name', text: u('title') }), h('span', { cls: 'plat-hint', text: u('sub') })));
    const go = () => { navTo('ipban'); document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === 'process')); ipRender(); };
    e.addEventListener('click', go); e.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
    row.replaceChildren(e);
  }
  const root = $('ipbRoot'); if (!root) return;
  if (ipS.step > 1 && !ipS.plat) ipS.step = 1;
  if (ipS.step === 3 && !ipS.body) ipS.step = 2;
  root.replaceChildren(h('div', { cls: 'card' }, ipHead(), ipSteps(), ipS.step === 1 ? ipStep1() : ipS.step === 2 ? ipStep2() : ipStep3(), h('div', { cls: 'tip' }, h('div', { text: u('note') }), h('div', { style: 'margin-top:6px', text: u('noGuar') }))));
}


/* ---------- init ---------- */
setTimeout(() => $('splash').classList.add('hide'), 1000);
$('dateIn').max = todayStr();
buildPlats(); renderHome(); setStage(1);
setLang(uiLang, false);
})();
