class GetOrdenesesList {
  constructor(ordenesesRepository) {
    this.$ordeneses = ordenesesRepository;
  }

  async execute() {
    // 🔥 Ahora usamos la consulta súper rápida y optimizada
    const ordeneses = await this.$ordeneses.listForDashboard();
    return ordeneses;
  }
}

module.exports = GetOrdenesesList;