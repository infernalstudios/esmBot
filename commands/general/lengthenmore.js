import Command from "#cmd-classes/command.js";

class LengthenMoreCommand extends Command {
  async run() {
    await this.acknowledge();
    const input = this.getOptionString("url") ?? this.args.join(" ");
    this.success = false;
    if (!input || !input.trim() || !this.urlCheck(input)) return this.getString("commands.responses.lengthen.noInput");
    if (this.urlCheck(input)) {
      const url = await fetch(encodeURI(input), { method: "HEAD", redirect: "manual" });
      this.success = true;
      const lengthenedURL = url.headers.get("location") || input;

      try {
        // Replace all ascii characters with their percent-encoded equivalents
        const encodedURL = lengthenedURL.replace(/[\x00-\x7F]/g, (c) => {
          return "%" + c.charCodeAt(0).toString(16).toUpperCase();
        });
  
        return encodedURL;
      } catch (error) {
        return lengthenedURL;
      }
    }
    return this.getString("commands.responses.lengthen.notURL");
  }

  /**
   * @param {string} string
   */
  urlCheck(string) {
    const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
    const domainRE = /^[^\s.]+\.\S{2,}$/;
    const match = string.match(protocolAndDomainRE);
    if (!match) {
      return false;
    }
    const everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
      return false;
    }
    if (domainRE.test(everythingAfterProtocol)) {
      return true;
    }
    return false;
  }

  static flags = [
    {
      name: "url",
      type: "string",
      description: "The URL you want to lengthen",
      classic: true,
      required: true,
    },
  ];

  static description = "Lengthens a normal URL even more";
  static aliases = [];
}

export default LengthenMoreCommand;
