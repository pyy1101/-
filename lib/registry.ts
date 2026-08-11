import JsonFormatter from "@/components/tools/JsonFormatter";
import Base64Tool from "@/components/tools/Base64Tool";
import WordCounter from "@/components/tools/WordCounter";
import TimestampConverter from "@/components/tools/TimestampConverter";
import UuidGenerator from "@/components/tools/UuidGenerator";
import ColorPicker from "@/components/tools/ColorPicker";
import MarkdownPreview from "@/components/tools/MarkdownPreview";
import ImageCompressor from "@/components/tools/ImageCompressor";
import UrlEncoder from "@/components/tools/UrlEncoder";
import HashGenerator from "@/components/tools/HashGenerator";
import RegexTester from "@/components/tools/RegexTester";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import DiffChecker from "@/components/tools/DiffChecker";
import IpLookup from "@/components/tools/IpLookup";
import JsonToCsv from "@/components/tools/JsonToCsv";
import Timer from "@/components/tools/Timer";
import CssMinifier from "@/components/tools/CssMinifier";
import HtmlEntity from "@/components/tools/HtmlEntity";
import PxToRem from "@/components/tools/PxToRem";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import NumberBase from "@/components/tools/NumberBase";
import CaseConverter from "@/components/tools/CaseConverter";
import SqlFormatter from "@/components/tools/SqlFormatter";
import TextDedup from "@/components/tools/TextDedup";
import JwtParser from "@/components/tools/JwtParser";
import YamlJson from "@/components/tools/YamlJson";
import MermaidPreview from "@/components/tools/MermaidPreview";
import QrCodeDecoder from "@/components/tools/QrCodeDecoder";
import ImageToBase64 from "@/components/tools/ImageToBase64";
import HtmlToMarkdown from "@/components/tools/HtmlToMarkdown";
import VideoTranscoder from "@/components/tools/VideoTranscoder";

export const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "base64": Base64Tool,
  "url-encoder": UrlEncoder,
  "word-counter": WordCounter,
  "timestamp": TimestampConverter,
  "uuid-generator": UuidGenerator,
  "color-picker": ColorPicker,
  "markdown-preview": MarkdownPreview,
  "image-compress": ImageCompressor,
  "hash-generator": HashGenerator,
  "regex-tester": RegexTester,
  "qr-code": QrCodeGenerator,
  "diff-checker": DiffChecker,
  "ip-lookup": IpLookup,
  "json-to-csv": JsonToCsv,
  "timer": Timer,
  "css-minifier": CssMinifier,
  "html-entity": HtmlEntity,
  "px-to-rem": PxToRem,
  "password-generator": PasswordGenerator,
  "number-base": NumberBase,
  "case-converter": CaseConverter,
  "sql-formatter": SqlFormatter,
  "text-dedup": TextDedup,
  "jwt-parser": JwtParser,
  "yaml-json": YamlJson,
  "mermaid-preview": MermaidPreview,
  "qr-decode": QrCodeDecoder,
  "image-to-base64": ImageToBase64,
  "html-to-markdown": HtmlToMarkdown,
  "video-transcoder": VideoTranscoder,
};

export default toolComponents;
