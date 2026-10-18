// Structured Resume & Architectural Portfolio Data for Saurav Kumar
window.PORTFOLIO_DATA = {
  profile: {
    name: "Saurav Kumar",
    role: "AEM Developer | AEM DAM & AEM Assets (AEMaaCS)",
    tagline: "Architecting cloud-native Adobe Experience Manager (AEMaaCS) & AEM 6.5 platforms, automated DAM asset pipelines, high-speed Oak indexing, and scalable global digital experiences.",
    experienceTotal: "5+ Years",
    aemaacsExperience: "1+ Year",
    aem65Experience: "4+ Years",
    currentCompany: "Capgemini",
    phone: "+91 7488024088",
    email: "sauravraj32424@gmail.com",
    linkedin: "https://www.linkedin.com/in/saurav-kumar-716108142",
    linkedinLabel: "linkedin.com/in/saurav-kumar-716108142",
    summary: "Experienced AEM Developer with 5+ years of expertise across Adobe Experience Manager as a Cloud Service (AEMaaCS) and AEM 6.5 (On-Premise), specializing in AEM Sites, AEM Assets (DAM), Components, Editable Templates, Custom Workflows, Oak Indexing, and Sling Servlets. Proven hands-on experience in cloud-native DAM asset processing, JCR query performance optimization, content migration, and workflow automation. Strong problem-solving abilities with a track record of delivering scalable, high-performance digital experiences for global enterprises."
  },
  skills: [
    {
      id: "aemaacs",
      name: "AEM as a Cloud Service (AEMaaCS)",
      category: "AEM Platforms",
      years: "1+ Year",
      level: 92,
      featured: true,
      summary: "Cloud-native DAM architecture, post-processing workflows, immutable repository structure (/apps & /libs vs /conf & /content), and Adobe Cloud Manager CI/CD deployment standards.",
      usedAt: ["Capgemini", "Aventior Digital"],
      snippet: `// AEMaaCS Asset Post-Processing Workflow Step (OSGi DS 1.4)
@Component(service = WorkflowProcess.class,
    property = {"process.label=Capgemini DAM Metadata & Rendition Processor"})
public class DamAssetPostProcessor implements WorkflowProcess {
    @Reference
    private ResourceResolverFactory resolverFactory;

    @Override
    public void execute(WorkItem item, WorkflowSession session, MetaDataMap args) {
        String payloadPath = item.getWorkflowData().getPayload().toString();
        // Cloud-compliant asset metadata normalization & rendition verification
    }
}`
    },
    {
      id: "aem65",
      name: "AEM 6.5 On-Premise",
      category: "AEM Platforms",
      years: "4+ Years",
      level: 96,
      featured: true,
      summary: "End-to-end AEM 6.5 On-Premise architecture, multi-site rollout for Castrol and BP, custom components, editable templates, content migration, and platform upgrades.",
      usedAt: ["Aventior Digital", "Wipro Limited"],
      snippet: `<!-- Editable Template Structure Policy Configuration -->
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        cq:template="/conf/enterprise-platform/settings/wcm/templates/content-page"
        sling:resourceType="enterprise/components/structure/page"/>
</jcr:root>`
    },
    {
      id: "aem-assets",
      name: "AEM Assets (DAM)",
      category: "AEM Platforms",
      years: "5+ Years",
      level: 95,
      featured: true,
      summary: "Enterprise Digital Asset Management (DAM) ingestion pipelines, metadata schemas, custom workflow launchers, rendition generation, and approval lifecycles.",
      usedAt: ["Capgemini", "Aventior Digital"],
      snippet: `// Querying Approved Enterprise Brand Assets in /content/dam
Map<String, String> predicate = new HashMap<>();
predicate.put("path", "/content/dam/enterprise-brand");
predicate.put("type", "dam:Asset");
predicate.put("1_property", "jcr:content/metadata/dam:status");
predicate.put("1_property.value", "approved");
predicate.put("p.limit", "50");`
    },
    {
      id: "aem-sites",
      name: "AEM Sites & Editable Templates",
      category: "AEM Platforms",
      years: "5+ Years",
      level: 95,
      featured: true,
      summary: "Reusable authoring components, Core Components extension, Editable Templates, Layout Container policies, and multi-country localized site structures (Castrol & BP).",
      usedAt: ["Aventior Digital", "Wipro Limited"],
      snippet: `<!-- Sightly (HTL) Reusable Hero Component Markup -->
<section data-sly-use.model="com.enterprise.core.models.HeroBannerModel"
         class="cmp-hero-banner"
         data-cmp-data-layer="\${model.data.json}">
    <h1 class="cmp-hero-banner__title">\${model.headline @ context='text'}</h1>
    <p class="cmp-hero-banner__subtitle">\${model.subheading @ context='html'}</p>
</section>`
    },
    {
      id: "cloud-manager",
      name: "Adobe Cloud Manager",
      category: "AEM Platforms",
      years: "1+ Year",
      level: 88,
      featured: false,
      summary: "Managing cloud deployments via Adobe Cloud Manager CI/CD pipelines, resolving SonarQube/Oakpal code quality gate issues, and maintaining release runbooks.",
      usedAt: ["Capgemini", "Aventior Digital"],
      snippet: `# Cloud Manager Quality Gate Validation
mvn clean install -PautoInstallSinglePackage \\
  -Dcloudmanager.qualityGate=strict \\
  -Doakpal.scan=true`
    },
    {
      id: "java-osgi",
      name: "Java & OSGi Services",
      category: "AEM & Backend Stack",
      years: "5+ Years",
      level: 94,
      featured: true,
      summary: "Modular backend services using OSGi R7 Declarative Services (@Component, @Designate, @ObjectClassDefinition), Event Handlers, and cron-based Schedulers.",
      usedAt: ["Capgemini", "Aventior Digital", "Wipro Limited"],
      snippet: `@ObjectClassDefinition(name = "DAM Asset Sync Scheduler Configuration")
public @interface AssetSyncConfig {
    @AttributeDefinition(name = "Cron Expression")
    String scheduler_expression() default "0 0 2 * * ?";
    @AttributeDefinition(name = "DAM Root Path")
    String dam_root_path() default "/content/dam/global";
}`
    },
    {
      id: "sling-models-servlets",
      name: "Apache Sling, Sling Models & Servlets",
      category: "AEM & Backend Stack",
      years: "5+ Years",
      level: 95,
      featured: true,
      summary: "ResourceType and Path-based Sling Servlets, Sling Models with Jackson Exporter for headless/SPA JSON delivery, and RESTful backend integrations.",
      usedAt: ["Capgemini", "Aventior Digital", "Wipro Limited"],
      snippet: `@Component(service = Servlet.class)
@SlingServletResourceTypes(
    resourceTypes = "enterprise/components/dam/asset-search",
    methods = HttpConstants.METHOD_GET,
    extensions = "json",
    selectors = "results"
)
public class DamAssetSearchServlet extends SlingSafeMethodsServlet { ... }`
    },
    {
      id: "custom-workflows",
      name: "Custom Workflows & Launchers",
      category: "AEM & Backend Stack",
      years: "5+ Years",
      level: 94,
      featured: true,
      summary: "Custom Workflow Process Steps, Participant Choosers, Workflow Launchers, and Post-Processing Workflows automating asset ingestion, metadata extraction, and approvals.",
      usedAt: ["Capgemini", "Aventior Digital"],
      snippet: `// Custom Workflow Step Metadata Persistence
ModifiableValueMap metadata = assetResource
    .getChild("jcr:content/metadata")
    .adaptTo(ModifiableValueMap.class);
if (metadata != null) {
    metadata.put("enterprise:processedDate", Calendar.getInstance());
    metadata.put("enterprise:ingestionState", "VALIDATED");
    resolver.commit();
}`
    },
    {
      id: "oak-indexing",
      name: "Oak Indexing (Lucene & Property) & JCR",
      category: "AEM & Backend Stack",
      years: "5+ Years",
      level: 93,
      featured: true,
      summary: "Creating and tuning custom Oak Indexes (Lucene & Property index definitions) compliant with AEMaaCS deployment standards to eliminate traversal bottlenecks.",
      usedAt: ["Capgemini"],
      snippet: `<enterpriseDamAssetLucene-1-custom-1
    jcr:primaryType="oak:QueryIndexDefinition"
    type="lucene"
    async="[async,nrt]"
    compatVersion="{Long}2"
    evaluatePathRestrictions="{{Boolean}}true"
    includedPaths="[/content/dam/enterprise]"
    queryPaths="[/content/dam/enterprise]">`
    },
    {
      id: "sightly-htl",
      name: "Sightly (HTL)",
      category: "AEM & Backend Stack",
      years: "5+ Years",
      level: 95,
      featured: false,
      summary: "Secure, XSS-protected Sightly (HTL) templates using data-sly-use, data-sly-list, data-sly-template, and clean separation of presentation and Sling Model logic.",
      usedAt: ["Aventior Digital", "Wipro Limited"],
      snippet: `<ul data-sly-list.item="\${model.navigationItems}" class="cmp-nav__list">
  <li class="cmp-nav__item">
    <a href="\${item.link @ extension='html'}">\${item.title}</a>
  </li>
</ul>`
    },
    {
      id: "frontend-stack",
      name: "HTML5, CSS3 & JavaScript",
      category: "Front-End Technologies",
      years: "5+ Years",
      level: 89,
      featured: false,
      summary: "Responsive clientlibs (cq:ClientLibraryFolder), semantic HTML5, modern CSS3 layouts, and vanilla ES6+ JavaScript for interactive authoring & end-user experiences.",
      usedAt: ["Capgemini", "Aventior Digital", "Wipro Limited"],
      snippet: `// AEM ClientLib Component Initializer
document.querySelectorAll('[data-cmp-is="asset-filter"]').forEach((el) => {
  el.addEventListener('change', (e) => dispatchAssetFilterEvent(e.target.value));
});`
    },
    {
      id: "devops-tools",
      name: "Git, GitHub, Maven, JUnit & Dispatcher",
      category: "Build, Testing & Tools",
      years: "5+ Years",
      level: 91,
      featured: true,
      summary: "Multi-module Maven builds (ui.apps, core, ui.content, dispatcher), JUnit 5 & AEM Mocks unit testing, Dispatcher caching/filter rules, Jira, and ServiceNow.",
      usedAt: ["Capgemini", "Aventior Digital", "Wipro Limited"],
      snippet: `@ExtendWith(AemContextExtension.class)
class DamAssetSearchServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    @Test
    void shouldReturnFilteredAssetsJson() { ... }
}`
    },
    {
      id: "analytics-marketing",
      name: "GA4, GTM, Google Search Console & Looker Studio",
      category: "Analytics & Marketing Tools",
      years: "4+ Years",
      level: 88,
      featured: true,
      summary: "End-to-end implementation of Google Analytics 4 (GA4), Google Tag Manager (GTM), Google Search Console (GSC), and Looker Studio (Data Studio) dashboards.",
      usedAt: ["Wipro Limited"],
      snippet: `window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'aem_component_interaction',
  componentName: 'localized-product-selector',
  countryMarket: 'en-GB',
  brandPortal: 'Castrol-Enterprise'
});`
    }
  ],
  experiences: [
    {
      id: "capgemini",
      role: "AEM Developer",
      company: "Capgemini",
      environment: "AEM as a Cloud Service",
      envTag: "AEMaaCS",
      period: "5th Jan 2026 – Present",
      current: true,
      highlights: [
        "Specialize in AEM Assets (DAM) development and architecture on AEM as a Cloud Service (AEMaaCS) to streamline enterprise digital asset management operations.",
        "Design, develop, and customize AEM Workflows (custom process steps, workflow launchers, and post-processing workflows) to automate asset ingestion, metadata extraction, rendition generation, and approval lifecycles.",
        "Create and optimize custom Oak Indexes (Lucene and Property index definitions) compliant with AEMaaCS deployment standards to tune JCR queries, significantly accelerating DAM asset search and reducing repository traversal bottlenecks.",
        "Develop scalable backend integrations using Sling Servlets (ResourceType and Path-based), OSGi Services, Sling Models, Event Handlers, and Schedulers to power complex asset operations and RESTful APIs.",
        "Manage cloud deployments via Adobe Cloud Manager CI/CD pipelines, resolving code quality gate issues and maintaining comprehensive technical documentation."
      ],
      techTags: ["AEMaaCS", "AEM Assets (DAM)", "Custom Workflows", "Oak Indexing (Lucene & Property)", "Sling Servlets", "OSGi Services", "Event Handlers & Schedulers", "Adobe Cloud Manager"]
    },
    {
      id: "aventior",
      role: "AEM Developer",
      company: "Aventior Digital",
      environment: "AEMaaCS & AEM 6.5 On-Premise",
      envTag: "Hybrid (AEMaaCS & 6.5)",
      period: "10th March 2025 – Jan 2026",
      current: false,
      highlights: [
        "Developed and delivered end-to-end solutions across AEM 6.5 (On-Premise) and AEM as a Cloud Service (AEMaaCS) environments based on business requirements and technical specifications.",
        "Designed, developed, and maintained reusable AEM components, editable templates, custom workflows, and backend services using Java, OSGi, Apache Sling, Sling Models, and Sightly (HTL).",
        "Collaborated closely with UX/UI designers, content authors, and business stakeholders to ensure a seamless authoring experience and high-performance content delivery.",
        "Created and maintained comprehensive technical documentation, including low-level design documents, Cloud/On-Prem deployment instructions, and QA test plans."
      ],
      techTags: ["AEMaaCS", "AEM 6.5 On-Premise", "Editable Templates", "Reusable Components", "Sling Models", "Sightly (HTL)", "Low-Level Design Docs"]
    },
    {
      id: "wipro",
      role: "Software Engineer",
      company: "Wipro Limited",
      environment: "AEM 6.5 On-Premise",
      envTag: "AEM 6.5 On-Premise",
      period: "27th Sept 2021 – 7th Feb 2025",
      current: false,
      highlights: [
        "Managed both technical development and team coordination on AEM 6.5 On-Premise environments, ensuring timely delivery of AEM Sites features and platform enhancements.",
        "Designed and developed custom AEM components and editable templates to support diverse business and multi-site authoring requirements.",
        "Collaborated with content authoring teams to build and manage multi-country localized site pages for global enterprise clients (Castrol and BP), ensuring brand consistency and regional compliance.",
        "Contributed to critical site launch activities, including large-scale content migration, performance optimization, QA validation, and go-live support.",
        "Implemented and configured Google Analytics (GA4), Google Tag Manager (GTM), Google Search Console (GSC), and Looker Studio (Data Studio) to enable granular data tracking and performance analysis."
      ],
      techTags: ["AEM 6.5 On-Premise", "AEM Sites", "Castrol & BP Global Rollouts", "Multi-Country Localization", "Content Migration", "GA4 & GTM", "GSC & Looker Studio"]
    }
  ],
  blueprints: [
    {
      id: "dam-workflow",
      title: "Cloud-Native DAM Asset Ingestion & Post-Processing Pipeline",
      org: "Capgemini • AEM as a Cloud Service (AEMaaCS)",
      category: "AEM Assets & Workflows",
      problem: "Enterprise DAM operations required automated metadata normalization, custom rendition validation, and multi-stage approval lifecycles upon asset upload in AEMaaCS.",
      solution: "Architected custom AEM Workflow Process Steps, Workflow Launchers, and Post-Processing Workflows integrated with OSGi services and Event Handlers.",
      outcomes: [
        "Automated asset ingestion, metadata extraction, rendition generation, and approval lifecycles across enterprise DAM folders.",
        "Built RESTful Sling Servlet endpoints (ResourceType & Path-based) and scheduled jobs to synchronize downstream asset state.",
        "Passed strict Adobe Cloud Manager CI/CD quality gates with full technical documentation."
      ],
      codeFilename: "DamAssetLifecycleProcess.java",
      codeLanguage: "java",
      code: `package com.capgemini.enterprise.dam.workflows;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Calendar;

@Component(
    service = WorkflowProcess.class,
    property = {
        "process.label=Enterprise DAM Metadata & Approval Lifecycle Step"
    }
)
public class DamAssetLifecycleProcess implements WorkflowProcess {

    private static final Logger LOG = LoggerFactory.getLogger(DamAssetLifecycleProcess.class);

    @Override
    public void execute(WorkItem workItem, WorkflowSession workflowSession, MetaDataMap args)
            throws WorkflowException {
        String payloadPath = workItem.getWorkflowData().getPayload().toString();
        ResourceResolver resolver = workflowSession.adaptTo(ResourceResolver.class);

        if (resolver == null || !payloadPath.startsWith("/content/dam")) {
            return;
        }

        Resource metadataRes = resolver.getResource(payloadPath + "/jcr:content/metadata");
        if (metadataRes != null) {
            ModifiableValueMap properties = metadataRes.adaptTo(ModifiableValueMap.class);
            if (properties != null) {
                properties.put("dam:enterpriseLifecycleStatus", "READY_FOR_REVIEW");
                properties.put("dam:lastProcessedOn", Calendar.getInstance());
                LOG.info("Processed DAM asset workflow metadata for {}", payloadPath);
            }
        }
    }
}`
    },
    {
      id: "oak-index",
      title: "AEMaaCS Custom Oak Indexing (Lucene & Property) & JCR Tuning",
      org: "Capgemini • AEM as a Cloud Service (AEMaaCS)",
      category: "Performance & JCR/Oak",
      problem: "High-volume JCR queries across deep enterprise DAM hierarchies caused repository traversal warnings and slow asset search responses.",
      solution: "Designed custom Lucene and Property Oak index definitions following AEMaaCS `<indexName>-<version>-custom-<customVersion>` naming standards with `evaluatePathRestrictions` and targeted `indexRules`.",
      outcomes: [
        "Eliminated unindexed JCR repository traversals for complex DAM metadata queries.",
        "Compliant with AEM as a Cloud Service immutable deployment pipeline (`/oak:index` package rules).",
        "Tuned QueryBuilder and JCR-SQL2 predicates to match indexed properties directly."
      ],
      codeFilename: "_oak_index/damAssetLucene-10-custom-2/.content.xml",
      codeLanguage: "xml",
      code: `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:oak="http://jackrabbit.apache.org/oak/ns/1.0"
          xmlns:dam="http://www.day.com/dam/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="oak:QueryIndexDefinition"
    async="[async,nrt]"
    compatVersion="{Long}2"
    evaluatePathRestrictions="{{Boolean}}true"
    includedPaths="[/content/dam/enterprise]"
    queryPaths="[/content/dam/enterprise]"
    type="lucene">
    <indexRules jcr:primaryType="nt:unstructured">
        <dam:Asset jcr:primaryType="nt:unstructured">
            <properties jcr:primaryType="nt:unstructured">
                <enterpriseAssetCategory
                    jcr:primaryType="nt:unstructured"
                    name="jcr:content/metadata/enterprise:category"
                    propertyIndex="{Boolean}true"
                    facets="{Boolean}true"/>
                <approvalStatus
                    jcr:primaryType="nt:unstructured"
                    name="jcr:content/metadata/dam:status"
                    propertyIndex="{Boolean}true"/>
                <lastModified
                    jcr:primaryType="nt:unstructured"
                    name="jcr:content/jcr:lastModified"
                    ordered="{Boolean}true"
                    propertyIndex="{Boolean}true"
                    type="Date"/>
            </properties>
        </dam:Asset>
    </indexRules>
</jcr:root>`
    },
    {
      id: "reusable-components",
      title: "Reusable AEM Components, Editable Templates & Sling Models",
      org: "Aventior Digital • AEMaaCS & AEM 6.5 On-Premise",
      category: "AEM Sites & Backend",
      problem: "Content authors needed modular, configurable components and editable templates that worked seamlessly across both AEM 6.5 On-Premise and AEMaaCS environments.",
      solution: "Engineered reusable Sightly (HTL) components backed by Sling Models, OSGi services, and low-level technical design specifications.",
      outcomes: [
        "Streamlined authoring workflows in Touch UI with intuitive dialogs and template policies.",
        "Exposed structured JSON via Sling Model Jackson Exporter for hybrid headless consumption.",
        "Delivered comprehensive Low-Level Design (LLD) docs, deployment guides, and QA test plans."
      ],
      codeFilename: "EnterpriseFeatureCardModel.java",
      codeLanguage: "java",
      code: `package com.aventior.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
    adaptables = {SlingHttpServletRequest.class, Resource.class},
    adapters = {EnterpriseFeatureCardModel.class, ComponentExporter.class},
    resourceType = EnterpriseFeatureCardModel.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class EnterpriseFeatureCardModel implements ComponentExporter {

    public static final String RESOURCE_TYPE = "aventior/components/content/feature-card";

    @ValueMapValue
    private String headline;

    @ValueMapValue
    private String description;

    @ValueMapValue
    private String ctaPath;

    public String getHeadline() { return headline; }
    public String getDescription() { return description; }
    public String getCtaPath() { return ctaPath; }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}`
    },
    {
      id: "global-localization-analytics",
      title: "Multi-Country Localized Platforms & GA4 / GTM Telemetry Suite",
      org: "Wipro Limited • Castrol & BP (AEM 6.5 On-Premise)",
      category: "Global Rollouts & Analytics",
      problem: "Global energy brands (Castrol and BP) required multi-country localized site rollouts, large-scale content migration, and unified analytics tracking across regional markets.",
      solution: "Built custom AEM 6.5 components and editable templates supporting localized multi-site authoring, paired with GA4, Google Tag Manager (GTM), Google Search Console (GSC), and Looker Studio reporting.",
      outcomes: [
        "Delivered localized multi-country pages for Castrol and BP with strict brand consistency and regional compliance.",
        "Executed large-scale content migration, performance tuning, QA validation, and go-live support.",
        "Configured granular GA4 event tracking via GTM and visualized KPIs in Looker Studio (Data Studio)."
      ],
      codeFilename: "analytics-datalayer-bridge.js",
      codeLanguage: "javascript",
      code: `/**
 * Multi-Market GA4 & GTM DataLayer Integration for AEM 6.5 Sites
 * Used across localized enterprise pages (Castrol & BP rollouts)
 */
(function (window, document) {
  'use strict';

  window.enterpriseAnalytics = {
    pushPageContext: function (pageMeta) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'aem_page_ready',
        page: {
          templateType: pageMeta.template || 'editable-content-page',
          countryLocale: pageMeta.locale || 'en_GB',
          brandUnit: pageMeta.brand || 'Castrol',
          publishEnvironment: 'aem65-onprem-prod'
        }
      });
    },
    trackComponentClick: function (componentId, actionLabel) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'aem_component_click',
        componentId: componentId,
        actionLabel: actionLabel,
        timestamp: new Date().toISOString()
      });
    }
  };
})(window, document);`
    }
  ],
  oakScenarios: {
    "dam-approved": {
      label: "DAM Approved Brand Assets Lookup",
      sql2: "SELECT * FROM [dam:Asset] AS a WHERE ISDESCENDANTNODE(a, '/content/dam/enterprise') AND a.[jcr:content/metadata/dam:status] = 'approved' ORDER BY a.[jcr:content/jcr:lastModified] DESC",
      modes: {
        unindexed: {
          plan: "[dam:Asset] as [a] /* traverse \"/content/dam/enterprise//*\" where ([a].[jcr:content/metadata/dam:status] = 'approved') */",
          nodesScanned: "48,500 nodes traversed",
          execTime: "1,420 ms",
          costScore: 95,
          status: "WARN: Traversed 48,500 nodes — Repository bottleneck detected",
          statusClass: "text-amber-400 border-amber-500/40 bg-amber-500/10"
        },
        property: {
          plan: "[dam:Asset] as [a] /* property damStatus = 'approved' where isdescendantnode([a], [/content/dam/enterprise]) */",
          nodesScanned: "620 nodes read (in-memory sort required)",
          execTime: "94 ms",
          costScore: 28,
          status: "GOOD: Property index matched dam:status, but jcr:lastModified sort evaluated in memory",
          statusClass: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
        },
        lucene: {
          plan: "[dam:Asset] as [a] /* lucene:damAssetLucene-10-custom-2(/oak:index/damAssetLucene-10-custom-2) +:ancestors:/content/dam/enterprise +jcr:content/metadata/dam:status:approved sort:jcr:content/jcr:lastModified DESC */",
          nodesScanned: "25 index entries matched directly",
          execTime: "11 ms",
          costScore: 6,
          status: "OPTIMAL (AEMaaCS Compliant): Path restriction, filter & sort resolved inside Oak Lucene index",
          statusClass: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
        }
      }
    },
    "rendition-audit": {
      label: "DAM Post-Processing Workflow Status Query",
      sql2: "SELECT * FROM [dam:Asset] AS a WHERE ISDESCENDANTNODE(a, '/content/dam/global-campaigns') AND a.[jcr:content/metadata/enterprise:ingestionState] = 'VALIDATED'",
      modes: {
        unindexed: {
          plan: "[dam:Asset] as [a] /* traverse \"/content/dam/global-campaigns//*\" */",
          nodesScanned: "72,000 nodes traversed",
          execTime: "2,180 ms",
          costScore: 98,
          status: "WARN: Potential Oak traversal limit exceeded (>100k cursor warning risk)",
          statusClass: "text-rose-400 border-rose-500/40 bg-rose-500/10"
        },
        property: {
          plan: "[dam:Asset] as [a] /* property enterpriseIngestionState = 'VALIDATED' */",
          nodesScanned: "190 nodes read",
          execTime: "32 ms",
          costScore: 15,
          status: "OPTIMAL (Property Index): Synchronous exact-match lookup on workflow state property",
          statusClass: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
        },
        lucene: {
          plan: "[dam:Asset] as [a] /* lucene:damAssetLucene-10-custom-2 +:ancestors:/content/dam/global-campaigns +jcr:content/metadata/enterprise:ingestionState:VALIDATED */",
          nodesScanned: "42 index entries matched directly",
          execTime: "9 ms",
          costScore: 5,
          status: "OPTIMAL (Async/NRT Lucene): Scoped to /content/dam/global-campaigns with evaluatePathRestrictions",
          statusClass: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
        }
      }
    },
    "localized-sites": {
      label: "Multi-Country Localized Site Template Audit (Castrol / BP)",
      sql2: "SELECT * FROM [cq:Page] AS p WHERE ISDESCENDANTNODE(p, '/content/enterprise-sites/en-gb') AND p.[jcr:content/cq:template] = '/conf/enterprise/settings/wcm/templates/product-page'",
      modes: {
        unindexed: {
          plan: "[cq:Page] as [p] /* traverse \"/content/enterprise-sites/en-gb//*\" */",
          nodesScanned: "18,400 nodes traversed",
          execTime: "640 ms",
          costScore: 78,
          status: "WARN: Full subtree scan across localized site hierarchy",
          statusClass: "text-amber-400 border-amber-500/40 bg-amber-500/10"
        },
        property: {
          plan: "[cq:Page] as [p] /* property cqTemplate = '/conf/enterprise/settings/wcm/templates/product-page' */",
          nodesScanned: "310 nodes read",
          execTime: "28 ms",
          costScore: 14,
          status: "GOOD: Fast property index lookup on cq:template",
          statusClass: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
        },
        lucene: {
          plan: "[cq:Page] as [p] /* lucene:cqPageLucene-custom-1 +:ancestors:/content/enterprise-sites/en-gb +jcr:content/cq:template:/conf/enterprise/settings/wcm/templates/product-page */",
          nodesScanned: "38 index entries matched directly",
          execTime: "7 ms",
          costScore: 4,
          status: "OPTIMAL: Instantaneous lookup combining path ancestor restriction + template property",
          statusClass: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
        }
      }
    }
  },
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) in Electronics and Communication Engineering",
      institution: "Asansol Engineering College",
      period: "Aug 2017 – Aug 2021",
      badge: "B.Tech • ECE"
    },
    {
      degree: "Higher Secondary Education – Science",
      institution: "Sri Chaitanya Vidya Niketan",
      period: "June 2015 – March 2017",
      badge: "Higher Secondary • Science"
    }
  ],
  achievements: [
    {
      title: "Victory League Award",
      subtitle: "Recognized for technical delivery excellence, ownership, and high-impact contributions on enterprise AEM engagements."
    },
    {
      title: "Habit Flagbearer – Being Responsive",
      subtitle: "Honored for proactive stakeholder communication, rapid incident triage, and collaborative cross-functional execution."
    }
  ],
  languages: [
    { name: "English", proficiency: "Fluent" },
    { name: "Hindi", proficiency: "Fluent" }
  ]
};
