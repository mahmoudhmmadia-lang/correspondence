// Editorial summaries of the main-guide chapters.
// Keep each idea grounded in its linked source section, in both languages.
// A step is [title, idea, Horizon example, target label, optional path in Kayan].
export const chapterOverviews = {
  'ch:intro': {
    en: {
      title: 'From scattered work to a clear result',
      intro: 'Meet Horizon Services Co., our fictional company throughout the guide. Sarah Al-Khatib handles HR; Omar Haddad coordinates operations.',
      result: 'Everyone knows where to work, what they can do and who owns the next step.',
      steps: [
        ['Bring work together', 'Choose the app that matches the work you need to organize.', 'Sarah opens HR for employee records; Omar uses Tasks to follow an office-setup request.', 'tab:intro-app-map'],
        ['Build what is specific to you', 'An authorized administrator can build records, forms and approval paths without code.', 'Horizon’s administrator builds a visit request that Omar submits and Sarah reviews.', 'sec:intro-no-code'],
        ['Give each person the right access', 'Roles define what people can see and do. Check access before relying on it.', 'Omar can submit a visit request; Sarah’s role can approve it.', 'sec:intro-control'],
        ['Follow the work to completion', 'Assign an owner and a due date, then update the status and review the result.', 'Omar completes the office-setup request and attaches the result for his manager to review.', 'sec:intro-entity'],
      ],
    },
    ar: {
      title: 'من أعمال متفرقة إلى نتيجة واضحة',
      intro: 'نرافق شركة الأفق للخدمات، وهي مثالنا الافتراضي طوال الدليل. تتولى سارة الخطيب الموارد البشرية، ويعمل عمر حداد منسقاً للعمليات.',
      result: 'يعرف كل شخص أين يعمل، وما يستطيع فعله، ومن يتولى الخطوة التالية.',
      steps: [
        ['اجمع العمل في مكان واحد', 'اختر التطبيق المناسب للعمل الذي تريد تنظيمه.', 'تفتح سارة الموارد البشرية لملفات الموظفين، ويتابع عمر طلب تجهيز مكتب في المهام.', 'tab:intro-app-map'],
        ['ابنِ ما يخص عملك', 'يستطيع مسؤول مخوّل بناء السجلات والنماذج ومسارات الاعتماد دون برمجة.', 'يبني مسؤول الأفق طلب زيارة يقدّمه عمر وتراجعه سارة.', 'sec:intro-no-code'],
        ['حدّد صلاحيات كل شخص', 'تحدد الأدوار ما يراه الأشخاص وما يفعلونه. تحقّق من صلاحياتهم قبل الاعتماد عليها.', 'يستطيع عمر تقديم طلب زيارة، ويتيح دور سارة اعتماد الطلب.', 'sec:intro-control'],
        ['تابع العمل حتى إنجازه', 'حدّد المسؤول والموعد، ثم حدّث الحالة وراجع النتيجة.', 'ينجز عمر طلب تجهيز المكتب، ويرفق النتيجة ليراجعها مديره.', 'sec:intro-entity'],
      ],
    },
  },
  'ch:org-setup': {
    en: {
      title: 'Prepare a home for your team’s work',
      intro: 'Example: Horizon. Its setup administrator prepares the organization once. If it already exists, review its settings instead of creating another one.',
      result: 'The administrator can sign in, the settings are saved, and the organization is ready for team setup in HR.',
      steps: [
        ['Prepare the details', 'Have the contact method, organization details and administrator details ready.', 'Horizon chooses hzn as its example subdomain: hzn.kayanos.app.', 'sec:setup-before'],
        ['Create the organization', 'Verify the contact method, enter the administrator and organization details, then finish creation.', 'Horizon’s administrator signs in at the new address and checks the organization name.', 'sec:setup-create'],
        ['Set language and time', 'Review the time zone, default language and first day of the week, then save.', 'Horizon chooses Asia/Damascus and Arabic, and sets the week to match its working schedule.', 'sec:setup-settings'],
        ['Check, then prepare the team', 'Reopen the settings to confirm they were saved; keep the sign-in address for the team.', 'After verification, Sarah moves to HR to prepare Horizon’s people and positions.', 'sec:setup-check'],
      ],
    },
    ar: {
      title: 'جهّز مكاناً يجمع عمل الفريق',
      intro: 'مثال: شركة الأفق. يجهّز مسؤول الإعداد المؤسسة مرة واحدة. إن كانت موجودة بالفعل، يراجع إعداداتها بدلاً من إنشاء نسخة أخرى.',
      result: 'يدخل المدير بحسابه، وتُحفظ الإعدادات، وتصبح المؤسسة جاهزة لإعداد الفريق في الموارد البشرية.',
      steps: [
        ['جهّز البيانات', 'جهّز وسيلة التواصل وبيانات المؤسسة وحساب المدير.', 'تختار الأفق في مثالنا النطاق الفرعي hzn، فيصبح عنوانها hzn.kayanos.app.', 'sec:setup-before'],
        ['أنشئ المؤسسة', 'تحقّق من وسيلة التواصل، وأدخل بيانات المدير والمؤسسة، ثم أكمل الإنشاء.', 'يدخل مسؤول الأفق إلى العنوان الجديد ويتأكد من اسم المؤسسة.', 'sec:setup-create'],
        ['اضبط اللغة والوقت', 'راجع المنطقة الزمنية واللغة الافتراضية ويوم بداية الأسبوع، ثم احفظ.', 'تختار الأفق Asia/Damascus والعربية، وتضبط بداية الأسبوع بحسب أيام عملها.', 'sec:setup-settings'],
        ['تحقّق ثم جهّز الفريق', 'أعد فتح الإعدادات للتأكد من حفظها، واحتفظ بعنوان الدخول للفريق.', 'بعد التحقق، تنتقل سارة إلى الموارد البشرية لإعداد الموظفين والمناصب.', 'sec:setup-check'],
      ],
    },
  },
  'ch:hr': {
    en: {
      title: 'Connect people, working time and pay',
      intro: 'Example: Horizon. Sarah prepares the team’s records; Omar follows his working day. Payroll is handled by the payroll team when needed.',
      result: 'People are linked to their positions, working time is reviewable, and payroll can use the prepared records when needed.',
      steps: [
        ['Connect a person to a position', 'Create the member and position first. An assignment connects them; a department and location add context.', 'Sarah links Omar Haddad to the Operations Coordinator position at the Aleppo branch.', 'sec:hr-feature-assignments', 'HR › Workforce › Assignments'],
        ['Set working time', 'Prepare shifts and check which shift applies to each employee.', 'Horizon uses Office Hours, Sunday–Thursday, 09:00–17:00.', 'sec:hr-feature-shifts', 'HR › Time › Shifts'],
        ['Review the working day', 'Employees check attendance; HR reviews the team’s working time, corrections and leave.', 'Omar checks his recorded attendance; Sarah reviews the team’s attendance and leave.', 'sec:hr-feature-timesheets', 'HR › Time › Timesheets'],
        ['Calculate pay when needed', 'Prepare pay data and monthly inputs, review salary slips, then build payroll from approved slips.', 'Horizon’s payroll team reviews Omar’s monthly inputs and salary slip before including it in payroll.', 'sec:hr-feature-payrolls', 'HR › Payment › Payrolls'],
      ],
    },
    ar: {
      title: 'اربط الموظفين بالدوام والرواتب',
      intro: 'مثال: شركة الأفق. تُعدّ سارة سجلات الفريق، ويتابع عمر يوم عمله، ويتولى فريق الرواتب احتساب المستحقات عند الحاجة.',
      result: 'يرتبط الموظفون بمناصبهم، ويمكن مراجعة دوامهم، ثم استخدام البيانات المجهّزة للرواتب عند الحاجة.',
      steps: [
        ['اربط الموظف بالمنصب', 'أنشئ العضو والمنصب أولاً، ثم اربطهما بتعيين. ويمكن إضافة القسم والموقع لتوضيح مكان العمل.', 'تربط سارة عمر حداد بمنصب منسق عمليات في فرع حلب.', 'sec:hr-feature-assignments', 'الموارد البشرية › القوى العاملة › التعيينات'],
        ['حدّد وقت العمل', 'جهّز الورديات وتحقّق من الوردية المطبّقة على كل موظف.', 'تستخدم الأفق الدوام الإداري من الأحد إلى الخميس، 09:00–17:00.', 'sec:hr-feature-shifts', 'الموارد البشرية › الوقت › الورديات'],
        ['راجع يوم العمل', 'يراجع الموظف حضوره، وتتابع الموارد البشرية دوام الفريق وتصحيحاته وإجازاته.', 'يراجع عمر حضوره المسجّل، وتتابع سارة حضور الفريق وإجازاته.', 'sec:hr-feature-timesheets', 'الموارد البشرية › الوقت › جداول الدوام'],
        ['احتسب الرواتب عند الحاجة', 'جهّز بيانات الأجر ومدخلات الشهر، وراجع القسائم، ثم أعدّ كشف الرواتب من القسائم المعتمدة.', 'يراجع فريق الرواتب مدخلات عمر وقسيمته الشهرية قبل إدراجها في الكشف.', 'sec:hr-feature-payrolls', 'الموارد البشرية › الدفع › كشوف الرواتب'],
      ],
    },
  },
  'ch:tasks': {
    en: {
      title: 'Turn a request into a clear task',
      intro: 'Example: Horizon. Sarah Al-Khatib coordinates preparation for the Aleppo branch visit; Omar Haddad prepares the visit checklist.',
      result: 'Each piece of work has an owner, a due date and a current status, so the team can see what is done and what is blocking it.',
      steps: [
        ['Gather the work in a collection', 'A collection holds the tasks of one piece of work. It can be shared with the team or personal to you.', 'Sarah uses a “Horizon visits” collection for visit preparation, and Omar finds his work there.', 'sec:tasks-feature-collections', 'Tasks › Collections'],
        ['Create a task with an owner', 'Write a specific title, then set who handles it, when it is due and what is needed to act.', 'Sarah creates “Prepare visit checklist” and assigns it to Omar before the visit.', 'sec:tasks-feature-details', 'Tasks › collection › Add Task'],
        ['Record progress and blockers', 'Record what you did and what is blocking you, and keep the status current so others need not guess.', 'Omar records his checklist work and notes that the site address is still missing; Sarah sets the next step.', 'sec:tasks-feature-follow-up', 'Open the task'],
        ['Agree the stages of the work', 'A status template sets a task’s stages and the moves between them. An administrator prepares it in Builder.', 'The administrator reviews the visit-task template with Sarah: execution first, then result review.', 'sec:tasks-feature-statuses', 'Builder › Status templates'],
      ],
    },
    ar: {
      title: 'حوّل الطلب إلى مهمة واضحة',
      intro: 'مثال: شركة الأفق. تتابع سارة الخطيب تجهيز زيارة فرع حلب، ويُعدّ عمر حداد قائمة الزيارة.',
      result: 'لكل عمل مسؤول وموعد وحالة محدّثة، فيعرف الفريق ما أُنجز وما يعيق العمل.',
      steps: [
        ['اجمع العمل في مجموعة', 'تضم المجموعة مهام العمل الواحد، وقد تكون مشتركة لعمل الفريق أو شخصية لعملك الخاص.', 'تخصص سارة مجموعة «زيارات الأفق» لمهام التحضير، فيجد عمر عمله فيها.', 'sec:tasks-feature-collections', 'المهام › المجموعات'],
        ['أنشئ مهمة لها مسؤول', 'اكتب عنواناً محدداً، ثم حدّد من يتولاها وموعدها وما يلزم لتنفيذها.', 'تنشئ سارة مهمة «تجهيز قائمة الزيارة» وتسندها إلى عمر قبل موعد الزيارة.', 'sec:tasks-feature-details', 'المهام › مجموعة › إضافة مهمة'],
        ['سجّل التقدم والعوائق', 'سجّل ما أنجزته وما يعيقك، وحدّث الحالة حتى يتابع زميلك العمل دون تخمين.', 'يسجّل عمر ما أعدّه، ويذكر أن عنوان الموقع لم يصل بعد، فتحدد سارة الخطوة التالية.', 'sec:tasks-feature-follow-up', 'افتح المهمة'],
        ['وحّد مراحل العمل', 'يحدد قالب الحالات مراحل المهمة والانتقال بينها، ويهيّئه المسؤول من أدوات البناء.', 'يراجع المسؤول مع سارة قالب مهام الزيارات: التنفيذ أولاً، ثم مراجعة النتيجة.', 'sec:tasks-feature-statuses', 'أدوات البناء › قوالب الحالات'],
      ],
    },
  },
  'ch:projects': {
    en: {
      title: 'From an intended result to a reviewed project',
      intro: 'Example: Horizon. Sarah Al-Khatib plans better visit readiness and tracks the project preparing the Aleppo branch visit; Omar Haddad prepares the visit pack.',
      result: 'Larger work has a result, an owner and a budget, and its deliverables are reviewed before it is treated as complete.',
      steps: [
        ['Set the result in a plan', 'A plan brings together the intended result, the accountable target and the working period. Start here when you set a direction.', 'Sarah creates the plan “Improve Aleppo branch readiness” and selects the target responsible for visits.', 'sec:projects-feature-plans', 'Projects › Planning › Plans'],
        ['Define the project and its charter', 'Work with a defined scope becomes a project with a manager and an intended result. Its charter comes before detailed planning.', 'Sarah creates HZN-PRJ-01 to prepare the Aleppo branch visit and states its result in the charter.', 'sec:projects-feature-projects', 'Projects › PM Core › Projects'],
        ['Plan the cost', 'A budget holds cost lines, funding sources and expenditures, so you can compare planned and recorded amounts.', 'The finance owner records the travel line for the Aleppo visit, then compares it with recorded expenditures.', 'sec:projects-feature-budgets', 'Projects › Financial Management › Budgets'],
        ['Deliver and review the result', 'Define each deliverable, its date and acceptance criteria, then review delivery and acceptance separately.', 'Omar prepares the visit pack; Sarah reviews the deliverable at handover before treating preparation as complete.', 'sec:projects-feature-deliverables', 'Project › Execution › Deliverables / Products'],
      ],
    },
    ar: {
      title: 'من نتيجة مطلوبة إلى مشروع تُراجَع نتائجه',
      intro: 'مثال: شركة الأفق. تضع سارة الخطيب خطة لتحسين جاهزية الزيارات، وتتابع مشروع تجهيز زيارة فرع حلب، ويُعدّ عمر حداد ملف الزيارة.',
      result: 'لكل عمل كبير نتيجة ومسؤول وميزانية، وتُراجَع مخرجاته قبل اعتباره مكتملاً.',
      steps: [
        ['حدّد النتيجة في خطة', 'تجمع الخطة النتيجة المطلوبة والجهة المسؤولة والفترة. ابدأ بها عندما تحدد توجهاً.', 'تضع سارة خطة «تحسين جاهزية فرع حلب» وتختار الجهة المسؤولة عن الزيارات.', 'sec:projects-feature-plans', 'المشاريع › التخطيط › الخطط'],
        ['عرّف المشروع وميثاقه', 'العمل المحدد النطاق مشروع له مدير ونتيجة مطلوبة، ويسبق ميثاقُه التخطيطَ التفصيلي.', 'تنشئ سارة المشروع HZN-PRJ-01 لتجهيز زيارة فرع حلب، وتكتب نتيجته في الميثاق.', 'sec:projects-feature-projects', 'المشاريع › أساسيات إدارة المشاريع › المشاريع'],
        ['خطّط التكلفة', 'تجمع الميزانية بنود التكلفة ومصادر التمويل والمصروفات، فتقارن المبلغ المخطط بما سُجّل فعلاً.', 'يسجّل المسؤول المالي بند الانتقال لزيارة حلب، ثم يقارنه بالمصروفات المسجّلة.', 'sec:projects-feature-budgets', 'المشاريع › الإدارة المالية › الميزانيات'],
        ['سلّم النتيجة وراجعها', 'حدّد كل مخرج وموعده ومعيار قبوله، ثم راجع التسليم والقبول كلاً على حدة.', 'يُعدّ عمر ملف الزيارة، وتراجع سارة المخرج عند التسليم قبل اعتبار التحضير مكتملاً.', 'sec:projects-feature-deliverables', 'مشروع › التنفيذ › المخرجات / المنتجات'],
      ],
    },
  },
  'ch:builder': {
    en: {
      title: 'Build an app that fits your work',
      intro: 'Example: Horizon. Its system administrator builds the record type “Visit requests”; Omar Haddad submits the Aleppo branch visit request and Sarah Al-Khatib reviews it.',
      result: 'The team works in a published app, and you add forms, documents and reports to it when the work needs them.',
      steps: [
        ['Start with the record type', 'Decide what one record represents and add its fields. Every other tool works on the record type.', 'The administrator builds “Visit requests”, with fields such as the visit date.', 'sec:builder-map'],
        ['Try it, then publish', 'Every change stays a draft the team cannot see until you publish it, so try it with a real record first.', 'The administrator submits a trial visit request before publishing “Visit requests” to the team.', 'tab:builder-terms'],
        ['Put it in front of the team', 'After publishing, show it in navigation inside an app so members can reach it.', 'The administrator places “Visit requests” in the “Branch services” app.', 'fig:builder-overview-flow'],
        ['Add what the work needs', 'Later, add a request form, an approval path, documents and a dashboard. Each tool has a chapter in the Builder guide.', 'When Omar needs a form to submit requests, the administrator opens the “Forms” chapter.', 'sec:builder-pages'],
      ],
    },
    ar: {
      title: 'ابنِ تطبيقاً يناسب عملك',
      intro: 'مثال: شركة الأفق. يبني مسؤول النظام نوع سجلات «طلبات الزيارة»، يرفع فيه عمر حداد طلب زيارة فرع حلب، وتراجعه سارة الخطيب.',
      result: 'يعمل الفريق في تطبيق منشور، وتضيف إليه النماذج والمستندات والتقارير عندما يحتاج إليها العمل.',
      steps: [
        ['ابدأ بنوع السجلات', 'حدّد ما يمثله السجل الواحد وأضف حقوله؛ فكل أداة أخرى تعمل على نوع السجلات.', 'يبني المسؤول «طلبات الزيارة» بحقول مثل تاريخ الزيارة.', 'sec:builder-map'],
        ['جرّب ثم انشر', 'يبقى كل تعديل مسودة لا يراها الفريق حتى تنشره، لذلك جرّبه بسجل فعلي أولاً.', 'يرفع المسؤول طلب زيارة تجريبياً قبل أن ينشر «طلبات الزيارة» للفريق.', 'tab:builder-terms'],
        ['ضعه أمام الفريق', 'بعد النشر، أظهره في التنقل ضمن تطبيق حتى يصل إليه الأعضاء.', 'يضع المسؤول «طلبات الزيارة» في تطبيق «خدمات الفروع».', 'fig:builder-overview-flow'],
        ['أضف ما يحتاجه العمل', 'أضف لاحقاً نموذج طلب ومسار اعتماد ومستندات ولوحة أرقام، ولكل أداة فصل في دليل أدوات البناء.', 'عندما يحتاج عمر إلى نموذج يرفع منه الطلب، يفتح المسؤول فصل «النماذج».', 'sec:builder-pages'],
      ],
    },
  },
  'ch:correspondence': {
    en: {
      title: 'Follow a letter from draft to dispatch',
      intro: 'Example: Horizon. Omar Haddad prepares a request to coordinate the Aleppo branch visit; Sarah Al-Khatib reviews it, the General Manager signs it, and the registry clerk records its dispatch.',
      result: 'You act in the right capacity, prepare a saved draft, know who decides next, and can tell issuing from dispatch and delivery.',
      steps: [
        ['Choose your capacity and find your work', 'Your capacity is the position you act as, and switching it grants no new permission. The tray groups your work into folders; the status tells you the letter’s stage.', 'Omar selects his “Operations Coordinator” position, then opens “Drafts” to follow his visit request.', 'sec:correspondence-feature-tray', 'Correspondence › Correspondence tray'],
        ['Prepare and save your draft', 'Complete the subject and addressees so the letter can be saved, then reopen it from Drafts to confirm its values.', 'Omar prepares the Aleppo Branch visit coordination request, saves it, and reopens it to check his work.', 'sec:correspondence-feature-compose', 'Correspondence › New letter'],
        ['Review, decide, hand on', 'A draft moves through review and approval, then each holder refers, answers or completes the work. Each decision names who owns the next step.', 'Sarah returns Omar’s visit request with a comment; once it is sound, the General Manager signs it and Aleppo Branch handles it.', 'sec:correspondence-feature-approvals', 'Correspondence › Awaiting my approval'],
        ['Tell issuing, dispatch and delivery apart', 'Issuing numbers the letter, dispatch records that it left, and delivery documents the hand-over.', 'The Aleppo Branch visit request takes HZN/2026/0012 at signature, then Horizon’s registry clerk records its paper dispatch.', 'sec:correspondence-feature-outgoing-dispatch', 'Correspondence › Registry office'],
      ],
    },
    ar: {
      title: 'تابع الكتاب من المسودة إلى الإرسال',
      intro: 'مثال: شركة الأفق. يُعدّ عمر حداد طلب تنسيق زيارة فرع حلب، وتراجعه سارة الخطيب، ويوقّعه المدير العام، ثم يسجل موظف الديوان إرساله.',
      result: 'تعمل باسم الصفة الصحيحة، وتُعدّ مسودة محفوظة، وتعرف صاحب القرار التالي، وتميّز الإصدار من الإرسال والتسليم.',
      steps: [
        ['اختر صفتك وجد عملك', 'الصفة هي المنصب الذي تعمل باسمه، وتغييرها لا يمنحك صلاحية جديدة. ويجمع «صندوق المراسلات» عملك في مجلدات، أما الحالة فتصف مرحلة الكتاب.', 'يختار عمر منصبه «منسق عمليات»، ثم يفتح «المسودات» ليتابع طلب الزيارة.', 'sec:correspondence-feature-tray', 'المراسلات › صندوق المراسلات'],
        ['أعدّ مسودتك واحفظها', 'أكمل الموضوع والمخاطَبين ليُحفظ الكتاب، ثم أعد فتحه من «المسودات» لتتأكد من قيمه.', 'يُعدّ عمر طلب تنسيق زيارة فرع حلب ويحفظه، ثم يعيد فتحه لمراجعة عمله.', 'sec:correspondence-feature-compose', 'المراسلات › مراسلة جديدة'],
        ['راجع وقرّر وسلّم العمل', 'تمر المسودة بالمراجعة والاعتماد، ثم يحيل كل صاحب عمل مراسلته أو يجيب عنها أو ينجزها. ويحدد كل قرار صاحب الخطوة التالية.', 'تعيد سارة طلب الزيارة إلى عمر مع ملاحظتها، وبعد اكتماله يوقّعه المدير العام ويعالجه فرع حلب.', 'sec:correspondence-feature-approvals', 'المراسلات › بانتظار اعتمادي'],
        ['ميّز الإصدار من الإرسال والتسليم', 'الإصدار يعطي الكتاب رقمه، والإرسال يسجل خروجه، والتسليم يوثق وصوله باليد.', 'يأخذ طلب زيارة فرع حلب الرقم HZN/2026/0012 عند التوقيع، ثم يسجل موظف ديوان الأفق إرساله ورقياً.', 'sec:correspondence-feature-outgoing-dispatch', 'المراسلات › ديوان الهيئة'],
      ],
    },
  },
  'ch:settings': {
    en: {
      title: 'Set the rules the whole organization works by',
      intro: 'Example: Horizon. Its system administrator looks after these pages. A setting applies to the whole organization, so each change is made once and then checked.',
      result: 'You know which group holds each decision, who the change affects, and how to confirm its effect.',
      steps: [
        ['Confirm who you are', 'Organization settings hold the identity and defaults that the other apps start from.', 'The administrator checks that Horizon’s name and defaults are right before the team starts work.', 'sec:settings-feature-organization', 'Settings › Organization › Organization settings'],
        ['Decide who gets in', 'Roles define what each user can see and do; the security pages control how people sign in.', 'The administrator reviews the roles Sarah and Omar hold before enabling two-step verification.', 'sec:settings-feature-roles', 'Settings › Access and security › Roles'],
        ['Decide what needs approval', 'Choose which changes to forms and record types must be approved before they go live.', 'Horizon asks for approval before a change to the visit request form goes live.', 'sec:settings-feature-publishing-approval', 'Settings › Forms and publishing › Publishing & approval'],
        ['Decide how long records stay', 'Retention rules, holds and disposition reviews decide what happens to records over time.', 'The administrator reviews how long Horizon keeps its visit requests.', 'sec:settings-feature-record-keeping', 'Settings › Management › Record keeping'],
      ],
    },
    ar: {
      title: 'اضبط القواعد التي تعمل بها المؤسسة كلها',
      intro: 'مثال: شركة الأفق. يتولى مسؤول النظام هذه الصفحات. ويسري الإعداد على المؤسسة كلها، لذلك يغيّره مرة واحدة ثم يتأكد من أثره.',
      result: 'تعرف المجموعة التي تضم كل قرار، ومن يتأثر بالتغيير، وكيف تتأكد من نتيجته.',
      steps: [
        ['تأكد من هوية مؤسستك', 'تضم «إعدادات المؤسسة» الهوية والقيم الافتراضية التي تبدأ منها التطبيقات الأخرى.', 'يتأكد مسؤول النظام من اسم الأفق وقيمها الافتراضية قبل أن يبدأ الفريق عمله.', 'sec:settings-feature-organization', 'الإعدادات › المؤسسة › إعدادات المؤسسة'],
        ['حدّد من يدخل إلى النظام', 'تحدد الأدوار ما يراه كل مستخدم وما يفعله، وتضبط صفحات الأمان طريقة تسجيل الدخول.', 'يراجع مسؤول النظام دوري سارة وعمر قبل تفعيل التحقق بخطوتين.', 'sec:settings-feature-roles', 'الإعدادات › الوصول والأمان › الأدوار'],
        ['حدّد ما يحتاج إلى اعتماد', 'اختر التغييرات على النماذج وأنواع السجلات التي يجب اعتمادها قبل تطبيقها.', 'تشترط الأفق اعتماد أي تغيير في نموذج طلب الزيارة قبل تطبيقه.', 'sec:settings-feature-publishing-approval', 'الإعدادات › النماذج والنشر › النشر والاعتماد'],
        ['حدّد مدة بقاء السجلات', 'تحدد قواعد الاحتفاظ والتجميد ومراجعات الإتلاف مصير السجلات مع مرور الوقت.', 'يراجع مسؤول النظام المدة التي تحتفظ فيها الأفق بطلبات الزيارة.', 'sec:settings-feature-record-keeping', 'الإعدادات › الإدارة › حفظ السجلات'],
      ],
    },
  },
}

const icon = path => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`

// A switch that turns the chapter into its key ideas, plus the dialog that shows
// one idea's full explanation without leaving the diagram. Without JavaScript
// the switch is a plain disclosure and the links open the explanation itself.
export function renderChapterOverview(label, lang, resolve, esc) {
  const content = chapterOverviews[label]?.[lang]
  if (!content) return ''
  const ar = lang === 'ar'
  const t = ar
    ? { title: 'الفصل في مخطط', sub: 'أهم الأفكار مع مثال الأفق، دون بقية الفصل', on: 'مفعّل', off: 'متوقف', eyebrow: 'مثال: شركة الأفق', ideas: `${content.steps.length} أفكار رئيسية`, at: 'في الأفق', where: 'مكانها في كيان', read: 'اقرأ الشرح', result: 'النتيجة', note: 'المختصر مفعّل، ونخفي بقية الفصل. اقرأ شرح أي فكرة من زرها، أو اعرض الفصل كاملاً.', full: 'اعرض الفصل كاملاً', close: 'إغلاق', prev: 'الفكرة السابقة', next: 'الفكرة التالية', open: 'افتحه في الفصل', loading: 'جارٍ تحميل الشرح…' }
    : { title: 'Chapter at a glance', sub: 'Key ideas through the Horizon example, without the rest of the chapter', on: 'On', off: 'Off', eyebrow: 'Example: Horizon', ideas: `${content.steps.length} key ideas`, at: 'At Horizon', where: 'Where in Kayan', read: 'Read the explanation', result: 'The result', note: 'Shorthand is on, so the rest of the chapter is hidden. Read any idea from its button, or show the full chapter.', full: 'Show the full chapter', close: 'Close', prev: 'Previous idea', next: 'Next idea', open: 'Open it in the chapter', loading: 'Loading the explanation…' }
  const id = 'chapter-overview'
  // The path is split on "›" so each part is a crumb, in reading order.
  const where = path => path ? `<p class="overview-where"><span class="sr-only">${esc(t.where)}: </span>${icon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>')}${path.split('›').map(p => `<span>${esc(p.trim())}</span>`).join('<i aria-hidden="true">›</i>')}</p>` : ''
  const steps = content.steps.map(([title, idea, example, target, path], i) => `<li class="overview-step"><span class="overview-node" aria-hidden="true">${i + 1}</span><article class="overview-card"><h3>${esc(title)}</h3>${where(path)}<p class="overview-idea">${esc(idea)}</p><p class="overview-example"><span>${icon('<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4"/>')}${esc(t.at)}</span>${esc(example)}</p><a class="overview-more" href="${esc(resolve(target))}" data-overview-open="${i}" data-title="${esc(title)}">${esc(t.read)}${icon('<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>')}<span class="sr-only">: ${esc(title)}</span></a></article></li>`).join('')
  return `<details class="chapter-overview" id="${id}">
    <summary aria-controls="${id}-body"><span class="overview-symbol" aria-hidden="true">${icon('<rect x="3" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="16" width="7" height="5" rx="1.5"/><path d="M6.5 8v4.5a2 2 0 0 0 2 2h7a2 2 0 0 1 2 2"/>')}</span><span class="overview-label"><strong>${t.title}</strong><small>${t.sub}</small></span><span class="overview-switch" aria-hidden="true"><span class="overview-switch-text" data-on="${t.on}" data-off="${t.off}"></span><span class="overview-switch-track"><span class="overview-switch-thumb"></span></span></span></summary>
    <div class="overview-body" id="${id}-body">
      <header class="overview-head"><div class="overview-chips"><span>${t.eyebrow}</span><span>${t.ideas}</span></div><h2>${esc(content.title)}</h2><p>${esc(content.intro)}</p></header>
      <ol class="overview-flow">${steps}<li class="overview-step is-result"><span class="overview-node" aria-hidden="true">${icon('<path d="m5 12 5 5 9-10"/>')}</span><div class="overview-result"><strong>${t.result}</strong><p>${esc(content.result)}</p></div></li></ol>
      <div class="overview-note"><p>${t.note}</p><button class="btn" type="button" data-overview-full>${t.full}</button></div>
    </div>
  </details>
  <dialog class="overview-dialog" aria-labelledby="overview-dialog-title" data-loading="${t.loading}">
    <header class="overview-dialog-head"><div><span class="overview-dialog-eyebrow" data-ov-eyebrow></span><h2 id="overview-dialog-title" data-ov-title></h2></div><button class="icon-btn" type="button" data-ov-close aria-label="${t.close}">${icon('<path d="m6 6 12 12M18 6 6 18"/>')}</button></header>
    <div class="overview-dialog-body" data-ov-body></div>
    <footer class="overview-dialog-foot"><div class="overview-dialog-nav" data-ov-nav><button class="icon-btn" type="button" data-ov-step="-1" aria-label="${t.prev}" title="${t.prev}"><svg class="ic flip" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><span dir="ltr" data-ov-count></span><button class="icon-btn" type="button" data-ov-step="1" aria-label="${t.next}" title="${t.next}"><svg class="ic flip" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></div><a class="btn btn-primary" href="#" data-ov-full>${t.open}</a></footer>
  </dialog>`
}
