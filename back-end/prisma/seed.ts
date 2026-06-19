import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD_SALT_ROUNDS = 10;

async function main(): Promise<void> {
  const password = await bcrypt.hash('Demo@1234', PASSWORD_SALT_ROUNDS);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: 'cliente@energia.com' },
      update: { name: 'Ana Souza' },
      create: {
        email: 'cliente@energia.com',
        name: 'Ana Souza',
        password,
      },
    });

    // Re-seed projects (cascade deletes tasks/feedbacks)
    await tx.project.deleteMany({ where: { clientId: user.id } });

    const p1 = await tx.project.create({
      data: {
        name: 'Portal Monitoramento Energético',
        sector: 'energia',
        phase: 'build',
        health: 'GREEN',
        startDate: new Date('2026-01-15'),
        clientId: user.id,
      },
    });

    const p2 = await tx.project.create({
      data: {
        name: 'Automação de Medição',
        sector: 'energia',
        phase: 'design',
        health: 'ATTENTION',
        startDate: new Date('2026-03-01'),
        clientId: user.id,
      },
    });

    await tx.task.createMany({
      data: [
        {
          projectId: p1.id,
          title: 'Dashboard de consumo em tempo real',
          description: 'Painel interativo com gráficos de consumo por unidade',
          type: 'feature',
          status: 'DONE',
          assignedTo: 'developer',
          priority: 1,
        },
        {
          projectId: p1.id,
          title: 'Alertas de anomalia por setor',
          description: 'Notificações automáticas quando consumo ultrapassa limites',
          type: 'feature',
          status: 'IN_PROGRESS',
          assignedTo: 'developer',
          priority: 2,
        },
        {
          projectId: p1.id,
          title: 'Ajuste de layout mobile do dashboard',
          description: 'Responsividade e usabilidade em telas menores',
          type: 'design',
          status: 'IN_PROGRESS',
          assignedTo: 'designer',
          priority: 2,
        },
        {
          projectId: p1.id,
          title: 'Exportação de relatório PDF',
          description: 'Geração de relatório executivo mensal em PDF',
          type: 'feature',
          status: 'TODO',
          assignedTo: 'po',
          priority: 3,
        },
        {
          projectId: p2.id,
          title: 'Mapeamento de pontos de medição',
          description: 'Cadastro e georreferenciamento de medidores de campo',
          type: 'feature',
          status: 'IN_PROGRESS',
          assignedTo: 'developer',
          priority: 1,
        },
        {
          projectId: p2.id,
          title: 'Wireframes da tela de configuração',
          description: 'Fluxo de configuração de medidores para validação com cliente',
          type: 'design',
          status: 'DONE',
          assignedTo: 'designer',
          priority: 1,
        },
        {
          projectId: p2.id,
          title: 'Correção de drift nos dados históricos',
          description: 'Bug de descalibração nos dados importados do legado',
          type: 'bug',
          status: 'TODO',
          assignedTo: 'developer',
          priority: 2,
        },
      ],
    });

    console.log(`✔ Usuário: ${user.email}`);
    console.log(`✔ Projeto 1: ${p1.name} (${p1.id})`);
    console.log(`✔ Projeto 2: ${p2.name} (${p2.id})`);
    console.log('✔ 7 tasks criadas');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
